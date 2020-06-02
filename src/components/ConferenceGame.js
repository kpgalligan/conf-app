import React, { Component } from 'react'
import SockJS from 'sockjs-client'
import {Stomp} from "@stomp/stompjs";
import Phaser from 'phaser'

class BootScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'BootScene',
            active: true
        });
    }

    preload() {
        this.load.plugin('rexcirclemaskimageplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexcirclemaskimageplugin.min.js', true);

        // map tiles
        this.load.image('newmaptiles', 'assets/newmap/tuxmon-sample-32px-extruded.png');

        // map in json format
        this.load.tilemapTiledJSON('map', 'assets/newmap/tuxemon-town.json');
        this.load.tilemapTiledJSON('chatRoomMap', 'assets/newmap/chat-room.json');
        this.load.tilemapTiledJSON('secretRoomMap', 'assets/newmap/secret-room.json');
        this.load.tilemapTiledJSON('vipRoomMap', 'assets/newmap/vip-room.json');

        // our two characters
        this.load.spritesheet('player', 'assets/RPG_assets.png', {
            frameWidth: 32,
            frameHeight: 32
        });

        this.load.spritesheet('tv', 'assets/TV_animation.png', {
            frameWidth: 50,
            frameHeight: 50
        });

        // chat bubbles
        this.load.spritesheet('chatBubbles', 'assets/bubble_assets.png', {
            frameWidth: 26,
            frameHeight: 24
        });

        this.load.audio('mario', [
            'assets/audio/mario2.ogg',
            'assets/audio/mario2.mp3'
        ]);

        this.load.audio('dance', [
            'assets/audio/dance.ogg',
            'assets/audio/dance.mp3'
        ]);

        // our two characters
        this.load.spritesheet('dancers', 'assets/Dancing_assets.png', {
            frameWidth: 56,
            frameHeight: 56
        });

        this.load.image('talkRadius', 'assets/images/talkRadius.png');
    }

    create() {
        this.scene.start('firstWorld');
    }
}

class WorldSceneCollide {
    constructor(sprite, callback) {
        this.sprite = sprite
        this.callback = callback
    }
}

class PlayerAndInfo {
    playerId;
    id;
    isMe;
    container;
    player;
    chatBubble;
    talkRadius;
    lastPlayerInfo;

    constructor(playerId, id, isMe, container, player, chatBubble, talkRadius) {
        this.playerId = playerId;
        this.id = id;
        this.isMe = isMe
        this.container = container;
        this.player = player;
        this.chatBubble = chatBubble;
        this.talkRadius = talkRadius;
    }

    addLastPlayerInfo(playerInfo){
        this.lastPlayerInfo = playerInfo
    }
}

class WorldScene extends Phaser.Scene {

    constructor(sceneKey, mapKey, backOnBounds, appContext) {
        super({
            key: sceneKey
        });
        //This is the react app component that holds this game
        this.appContext = appContext
        //Unique key for this "world". May be multiple worlds for the same map
        this.worldKey = sceneKey
        //Key to the map definition
        this.mapKey = mapKey
        //Return to calling map when reaching bounds. Most/all maps are false. May remove this.
        this.backOnBounds = backOnBounds
        //Current position of player
        this.currentX = -10000
        this.currentY = -10000

        this.collides = []
        this.allPlayers = {}
        this.stompUserId = null
        this.music = null
    }

    otherPlayersIter(func){
        Object.keys(this.allPlayers).forEach((key) => {
            const playerAndInfo = this.allPlayers[key]
            if (!playerAndInfo.isMe) {
                func(this.allPlayers[key])
            }
        })
    }

    storePlayerInfo(playerInfo) {
        this.allPlayers[playerInfo.playerId] = playerInfo
    }

    shutDown() {
        this.stompClient.disconnect()
        clearInterval(this.movementTrackerIntervalId)
        this.sendTypingCallbacks.clear()
        delete this.player
        delete this.container
        delete this.talkRadius
        delete this.chatBubble
        this.music.pause()
        if (this.worldKey === "secretRoom") {
            this.danceMusic.pause()
        }
    }

    worldKeyHeader() {
        return {
            worldKey: this.worldKey
        }
    }

    connectHeaders(playerX, playerY) {
        return {
            worldKey: this.worldKey,
            playerX: playerX,
            playerY: playerY,
            id: this.appContext.props.currentUser.id
        }
    }

    sockJsConnect() {
        let socket = new SockJS('http://192.168.2.190:8080/gs-guide-websocket');
        this.stompClient = Stomp.over(socket)
        this.stompClient.debug = function (){};

        // this.stompClient.debug = null
        let headers = this.connectHeaders(this.currentX, this.currentY);
        this.stompClient.connect(headers, function (frame) {
            this.stompUserId = frame['headers']['user-name']

            this.stompClient.subscribe('/user/topic/currentPlayers/' + this.worldKey, (msg) => {
                let players = JSON.parse(msg.body)
                Object.keys(players).forEach((id) => {
                    if (players[id].playerId === this.stompUserId) {
                        this.storePlayerInfo(this.createPlayer(players[id], true))
                    } else {
                        this.storePlayerInfo(this.addOtherPlayers(players[id]))
                    }
                })
            })

            this.stompClient.subscribe('/topic/newPlayer/' + this.worldKey, (msg) => {
                let playerInfo = JSON.parse(msg.body)
                this.storePlayerInfo(this.addOtherPlayers(playerInfo))
            })

            //Can't we just remove by key?
            this.stompClient.subscribe('/topic/disconnect/' + this.worldKey, (msg) => {
                let playerId = msg.body
                let player = this.allPlayers[playerId]
                if (player) {
                    player.container.destroy();
                    delete this.allPlayers[playerId]
                }
            })

            this.stompClient.subscribe('/topic/playerMoved/' + this.worldKey, (msg) => {
                let playerMovementContainer = JSON.parse(msg.body)
                if (playerMovementContainer.clientId === this.stompUserId)
                    return

                let playerInfoArray = playerMovementContainer.playerMovements;
                let player = this.allPlayers[playerMovementContainer.clientId]
                if (player) {
                    playerInfoArray.forEach((playerInfo) => {

                        setTimeout(() => {
                            player.container.flipX = playerInfo[3] === 1;
                            player.container.setPosition(playerInfo[1], playerInfo[2]);
                            player.container.touchTyping()
                        }, playerInfo[0])

                    })
                }
            })

            this.stompClient.subscribe('/user/topic/hearMessage/' + this.worldKey, (msg) => {
                let sentMessage = JSON.parse(msg.body)
                const playerInfo = this.allPlayers[sentMessage.playerId]

                this.appContext.props.showMessage(
                    sentMessage,
                    playerInfo)
            })

            callSendMessage = (message) => {
                this.stompClient.send("/app/sendMessage", this.worldKeyHeader(), message)
            }

            this.stompClient.subscribe('/topic/playerTyping/' + this.worldKey, function (msg) {
                let playerId = msg.body
                let player = this.allPlayers[playerId]
                if (player && !player.isMe) {
                    player.container.showTyping()
                }
            }.bind(this));

            this.stompClient.subscribe('/topic/playerDoneTyping/' + this.worldKey, function (msg) {
                let playerId = msg.body
                let player = this.allPlayers[playerId]
                if (player && !player.isMe) {
                    player.container.hideTyping()
                }
            }.bind(this));

            this.stompClient.send("/app/connection", this.worldKeyHeader(), "connect")
        }.bind(this));
    }

    sendTypingCallbacks = smooth(function () {
        this.stompClient.send("/app/typing", this.worldKeyHeader(), "")
    }.bind(this), 1000)

    imTalkin = function () {
        this.talkRadius.visible = true
        this.chatBubble.visible = true
        this.sendTypingCallbacks.trigger()
    }.bind(this)

    imNotTalkin = function () {
        this.talkRadius.visible = false
        this.chatBubble.visible = false
        this.stompClient.send("/app/doneTyping", this.worldKeyHeader(), "")
        this.sendTypingCallbacks.clear()
    }.bind(this)

    playerMovement(x, y, flipX) {
        this.currentX = x
        this.currentY = y
        this.movements.push([
            Math.max(0, Date.now() - this.startTime),
            Math.floor(x),
            Math.floor(y),
            flipX ? 1 : 0
        ])

        this.otherPlayersIter((player) => player.container.touchTyping())
    }

    startMovementTracker() {
        this.startTime = Date.now()
        this.movements = []
        this.movementTrackerIntervalId = setInterval(function () {
            if (this.movements.length > 0) {
                this.stompClient.send("/app/playerMovement", this.worldKeyHeader(), JSON.stringify(this.movements))
                this.movements = []
            }
            this.startTime = Date.now()
        }.bind(this), 1000)
    }

    create(data) {
        this.input.keyboard.on('keydown', event => {
            switch (event.key) {
                case ' ':
                    this.appContext.props.startTalking()
                    break;
                default:
            }
        });

        this.isDone = false

        if (!this.music) {
            this.music = this.sound.add('mario');
        }

        if (!this.danceMusic) {
            this.danceMusic = this.sound.add('dance');
        }

        //Enable for music
        /*setTimeout(()=>{
            this.music.play({
                loop: true
            });
        }, 1000)*/

        if (this.worldKey === "secretRoom") {
            setTimeout(() => {
                this.danceMusic.play({
                    loop: true
                });
            }, 300)
        }

        // create map
        this.createMap();

        this.sockJsConnect()

        this.startMovementTracker()

        this.otherPlayers = this.physics.add.group();

        // create player animations
        this.createAnimations();

        // user input

        this.cursors = {
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
            up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
            down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)
        };
    }

    createMap() {
        // create the map
        this.map = this.make.tilemap({
            key: this.mapKey
        });

        // first parameter is the name of the tilemap in tiled
        var tiles = this.map.addTilesetImage('tuxmon-sample-32px-extruded', 'newmaptiles', 32, 32);

        // creating the layers
        this.map.createStaticLayer('Below Player', tiles, 0, 0);
        this.map.createStaticLayer('Secret Layer', tiles, 0, 0);
        this.obstacles = this.map.createStaticLayer('World', tiles, 0, 0);
        const abovePlayer = this.map.createStaticLayer('Above Player', tiles, 0, 0);

        abovePlayer.setDepth(10);

        // make all tiles in obstacles collidable
        this.obstacles.setCollisionByExclusion([-1]);

        // don't go out of the map
        this.physics.world.bounds.width = this.map.widthInPixels;
        this.physics.world.bounds.height = this.map.heightInPixels;

        if (this.currentX === -10000) {
            const spawnPoint = this.map.filterObjects("Objects", (obj) => {
                return obj.type === "SpawnPoint"
            })[0]
            this.currentX = spawnPoint.x
            this.currentY = spawnPoint.y
        }

        const chatNodes = this.map.filterObjects("Objects", (obj) => {
            return obj.type === "ChatNode"
        })

        const sponsorTouchBoxes = this.map.filterObjects("Objects", (obj) => {
            return obj.type === "SponsorTouch"
        })

        const textSignBoxes = this.map.filterObjects("Objects", (obj) => {
            return obj.type === "TextSign"
        })

        const worldChangeBoxes = this.map.filterObjects("Objects", (obj) => {
            return obj.type === "WorldChange"
        })

        const dancerPoints = this.map.filterObjects("Objects", (obj) => {
            return obj.type === "Dancer"
        })

        dancerPoints.forEach((pt) => this.makeDancer(pt))
        sponsorTouchBoxes.forEach((s) => this.makeSponsorBox(s))
        chatNodes.forEach((obj) => this.makeChatNode(obj))
        textSignBoxes.forEach((obj) => this.makeTextSignTrigger(obj))
        worldChangeBoxes.forEach((obj) => this.makeWorldChangeBox(obj))
    }

    makeDancer(pt) {
        let dancer = this.add.sprite(pt.x, pt.y, "dancers", 0)
        dancer.setSize(56, 56)
        dancer.anims.play(pt.name, true);
    }

    findProperty(sb, propName) {
        if (sb.properties) {
            const filtered = sb.properties.filter((prop) => prop.name === propName)
            if(filtered.length > 0)
                return filtered[0]
        }

        return null
    }

    makeWorldChangeBox(sb) {
        // const group = this.physics.add.staticGroup()
        const sbBox = this.physics.add.staticSprite(sb.x + 16, sb.y + 16)/*(sb.x + (sb.width/2), sb.y + (sb.height/2))*/
        sbBox.setSize(sb.width, sb.height);
        // this.physics.world.enable(sbBox);
        this.addCollide(sbBox, () => {
            /*const prop = this.findProperty(sb, "access")
            if (prop) {
                const roles = prop.value.split(",")
                if(!roles.includes(userProfiles[this.myPlayerInfo().profileUsername].role))
                {
                    showMessage("No access")
                    return
                }
            }*/
            this.showWorld(sb.name, true)
        })
    }

    makeTextSignTrigger(signBox) {

        // let playTable = this.physics.add.staticGroup()
        let textObject = this.add.text(signBox.x, signBox.y - 70, signBox.name,
            {
                padding: 6,
                fontSize: '24px',
                fontFamily: 'courier, courier new, serif'
            });

        textObject.x = textObject.x - (textObject.width / 2)
        textObject.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
        // textObject.style.padding = 8
        // textObject.style.fontSize = '46px'

        textObject.setBackgroundColor("#aa6600")
        textObject.visible = false
        textObject.setDepth(100)

        const sbBox = this.physics.add.staticSprite(signBox.x + 16, signBox.y + 16)
        sbBox.setSize(signBox.width, signBox.height);

        this.addCollide(sbBox, () => {
            textObject.visible = true
            this.container.onDoneTouching = () => textObject.visible = false
        })


    }

    makeSponsorBox(sb) {
        // const group = this.physics.add.staticGroup()
        const sbBox = this.physics.add.staticSprite(sb.x + 16, sb.y + 16)/*(sb.x + (sb.width/2), sb.y + (sb.height/2))*/
        sbBox.setSize(sb.width, sb.height);
        // this.physics.world.enable(sbBox);
        this.addCollide(sbBox, () => {
            console.log("sbBox: ", sbBox)
        })
    }

    makeChatNode(obj) {
        let playTable = this.physics.add.staticGroup()
        let tableSprite = playTable.create(obj.x, obj.y, "tv", 0)
        tableSprite.anims.play('tv_playing', true);
        tableSprite.setInteractive();
        /*if (obj.name) {
            tableSprite.on("pointerdown", function () {
                console.log("tv fuckers 2", obj)
                this.showChat(obj.name)
            }.bind(this), this)
        }*/
        this.addCollide(tableSprite, () => {
            this.appContext.props.showVideoChat(obj.name)
            this.container.onDoneTouching = () => this.appContext.props.hideVideoChat()
            // const chatApi = this.showChat(obj.name)
            // this.container.onDoneTouching = () => chatApi.executeCommand('hangup')
        })
    }

    addCollide(sprite, callback) {
        this.collides.push(new WorldSceneCollide(sprite, callback))
    }

    createAnimations() {

        this.anims.create({
            key: 'tv_playing',
            frames: this.anims.generateFrameNumbers('tv', {
                frames: [0, 1, 2, 0, 1, 2, 0, 1, 2, 3, 4, 5, 6, 3, 4, 5, 6, 7, 8]
            }),
            frameRate: 2,
            repeat: -1
        });

        //  animation with key 'left', we don't need left and right as we will use one and flip the sprite
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', {
                frames: [1, 7, 1, 13]
            }),
            frameRate: 10,
            repeat: -1
        });

        // animation with key 'right'
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', {
                frames: [1, 7, 1, 13]
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('player', {
                frames: [2, 8, 2, 14]
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('player', {
                frames: [0, 6, 0, 12]
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'talking',
            frames: this.anims.generateFrameNumbers('chatBubbles', {
                frames: [0, 1, 2]
            }),
            frameRate: 2,
            repeat: -1
        });
        this.anims.create({
            key: 'dancer1',
            frames: this.anims.generateFrameNumbers('dancers', {
                frames: [0, 1, 2, 3, 2, 1, 0]
            }),
            frameRate: 4,
            repeat: -1
        });
        this.anims.create({
            key: 'dancer2',
            frames: this.anims.generateFrameNumbers('dancers', {
                frames: [4, 5, 6, 7, 6, 5, 4]
            }),
            frameRate: 4,
            repeat: -1
        });
        this.anims.create({
            key: 'dancer3',
            frames: this.anims.generateFrameNumbers('dancers', {
                frames: [8, 9, 10, 11, 10, 9, 8]
            }),
            frameRate: 4,
            repeat: -1
        });
        this.anims.create({
            key: 'dancer4',
            frames: this.anims.generateFrameNumbers('dancers', {
                frames: [12, 13, 14, 15, 14, 13, 12]
            }),
            frameRate: 4,
            repeat: -1
        });
    }

    createPlayer(playerInfo, myPlayer) {
        // our player sprite created through the physics system
        this.container = this.add.container(playerInfo.x, playerInfo.y);
        this.container.setSize(32, 32);
        this.physics.world.enable(this.container);
        this.container.areaTouching = false

        this.player = this.add.sprite(0, 0, 'player', 6);
        this.container.add(this.player);

        if(myPlayer) {
            // don't walk on trees
            this.physics.add.collider(this.container, this.obstacles, () => {

            });

            // don't go out of the map
            this.container.body.setCollideWorldBounds(true);

            this.talkRadius = this.add.sprite(0, 0, 'talkRadius')
            // this.talkRadius.setScale(.5)
            this.container.add(this.talkRadius)
            this.talkRadius.visible = false

            // update camera
            this.updateCamera();

            this.collides.forEach((cl) => {
                const collider = this.physics.add.collider(
                    this.container,
                    cl.sprite,
                    () => {

                        if (!this.container.areaTouching) {
                            this.container.areaTouching = true
                            cl.callback()
                        }
                    }
                    ,
                    null,
                    this
                );
                collider.overlapOnly = true
            })

            if (this.backOnBounds) {
                this.container.body.onWorldBounds = true;
                this.physics.world.on('worldbounds', function (body) {
                    this.backWorld()
                }.bind(this), this);
            }
        }

        this.chatBubble = this.add.sprite(2, -40, 'chatBubbles', 0)
        this.container.add(this.chatBubble)
        this.chatBubble.anims.play('talking', true);
        this.chatBubble.visible = false
        this.chatBubble.setDepth(1550)

        this.addPlayerHead(this.container, playerInfo, this.chatBubble)

        const p = new PlayerAndInfo(
            playerInfo.playerId,
            playerInfo.id,
            true,
            this.container,
            this.player,
            this.chatBubble,
            this.talkRadius
        )

        p.addLastPlayerInfo(playerInfo)

        return p
    }

    addPlayerHead(container, playerInfo, chatBubble){
        const addHead = () => {
            const icon = this.add.rexCircleMaskImage(0, -20, playerInfo.playerId)
            icon.width = 20
            icon.height = 20
            container.add(icon)
            container.remove(chatBubble)
            container.add(chatBubble)
        }

        if (this.textures.exists(playerInfo.playerId)) {
            addHead()
        } else {
            let profileImage = this.appContext.props.userProfileUrl(playerInfo.id)
            const loader = this.load.image(playerInfo.playerId, profileImage)
            loader.start()

            loader.on('filecomplete', function (key, file) {
                if (key === playerInfo.playerId) {
                    addHead()
                }
            }, this);
        }
    }

    addOtherPlayers(playerInfo) {
        let container = this.add.container(playerInfo.x, playerInfo.y);
        container.setSize(32, 32);
        this.physics.world.enable(container);

        const otherPlayer = this.add.sprite(0, 0, 'player', 9);
        container.add(otherPlayer)

        let chatBubble = this.add.sprite(2, -40, 'chatBubbles', 0)
        container.add(chatBubble)
        chatBubble.anims.play('talking', true);
        chatBubble.visible = false
        chatBubble.setDepth(1550)

        container.player = otherPlayer
        container.chatBubble = chatBubble

        this.addPlayerHead(container, playerInfo, chatBubble)

        container.showTyping = float(
            () => {
                container.chatBubble.visible = true
                container.touchTyping()
            }
            ,
            () => container.hideTyping(),
            5000
        )

        container.hideTyping = () => container.chatBubble.visible = false

        container.touchTyping = () => {
            if (container.chatBubble.visible) {
                let distance = Math.sqrt(Math.pow(container.x - this.container.x, 2) + Math.pow(container.y - this.container.y, 2))
                if (distance < 90) {
                    chatBubble.alpha = 1
                } else {
                    chatBubble.alpha = .3
                }
            }
        }

        this.otherPlayers.add(container);
        const p = new PlayerAndInfo(
            playerInfo.playerId,
            playerInfo.id,
            false,
            container,
            otherPlayer,
            chatBubble,
            null)
        p.addLastPlayerInfo(playerInfo)
        return p
    }

    updateCamera() {
        // limit camera to map
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(this.container);
        this.cameras.main.roundPixels = true; // avoid tile bleed
    }

    doneTouching() {
        this.container.areaTouching = false
        if (this.container.onDoneTouching) {
            this.container.onDoneTouching()
            this.container.onDoneTouching = null
        }
    }

    update() {
        if (this.container) {

            // Treat 'embedded' as 'touching' also
            if (this.container.body.embedded) this.container.body.touching.none = false;

            var touching = !this.container.body.touching.none;
            var wasTouching = !this.container.body.wasTouching.none;

            if (!touching && wasTouching) this.doneTouching()

            this.container.body.setVelocity(0);

            // Horizontal movement
            if (this.cursors.left.isDown) {
                this.container.body.setVelocityX(-180);
            } else if (this.cursors.right.isDown) {
                this.container.body.setVelocityX(180);
            }

            // Vertical movement
            if (this.cursors.up.isDown) {
                this.container.body.setVelocityY(-180);
            } else if (this.cursors.down.isDown) {
                this.container.body.setVelocityY(180);
            }

            // Update the animation last and give left/right animations precedence over up/down animations
            if (this.cursors.left.isDown) {
                this.appContext.props.cancelTalking()
                this.player.anims.play('left', true);
                this.player.flipX = true;
            } else if (this.cursors.right.isDown) {
                this.appContext.props.cancelTalking()
                this.player.anims.play('right', true);
                this.player.flipX = false;
            } else if (this.cursors.up.isDown) {
                this.appContext.props.cancelTalking()
                this.player.anims.play('up', true);
            } else if (this.cursors.down.isDown) {
                this.appContext.props.cancelTalking()
                this.player.anims.play('down', true);
            } else {
                this.player.anims.stop();
            }

            // emit player movement
            let x = this.container.x;
            let y = this.container.y;
            let flipX = this.player.flipX;
            if (this.container.oldPosition && (x !== this.container.oldPosition.x || y !== this.container.oldPosition.y || flipX !== this.container.oldPosition.flipX)) {
                this.playerMovement(x, y, flipX)
            }
            // save old position data
            this.container.oldPosition = {
                x: this.container.x,
                y: this.container.y,
                flipX: this.player.flipX
            };
        }
    }

    showWorld(key, clearStack) {
        if (clearStack) {
            worldStack = []
        }
        worldStack.push({key: this.worldKey})
        this.shutDown()
        this.scene.start(key);
    }

    /*showChat(key) {
        let meetDiv = document.getElementById('meet');
        meetDiv.innerHTML = ""
        meetDiv.style.display = ""
        const domain = 'meet.jit.si';
        const options = {
            invitees: [],
            roomName: key,
            configOverwrite: {
                disableInviteFunctions: true
            },
            width: 600,
            height: 450,
            parentNode: document.querySelector('#meet')
        };
        const api = new JitsiMeetExternalAPI(domain, options);
        api.addEventListener("readyToClose", () => {
            meetDiv.style.display = "none"
        });
        return api
    }*/

    backWorld() {
        if (!this.isDone) {
            this.isDone = true
            let worldInfo = worldStack.pop()
            this.shutDown()
            this.scene.start(worldInfo.key);
        }
    }
}

class ConferenceGame extends Component {
    config = {
        type: Phaser.AUTO,
        parent: "phaser-game",
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1050, // Canvas width in pixels
        height: 800, // Canvas height in pixels
        // zoom: 2,
        pixelArt: true,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: {
                    y: 0
                },
                debug: true // set to true to view zones
            }
        },
        scene: [
            BootScene,
            new WorldScene(
                "firstWorld",
                "map",
                false,
                this),
            new WorldScene(
                "chatWorld",
                "chatRoomMap",
                false,
                this),
            new WorldScene(
                "secretRoom",
                "secretRoomMap",
                false,
                this),
            new WorldScene(
                "vipRoom",
                "vipRoomMap",
                false,
                this)

        ]
    };

    resizeGameWindow = () => {
        const widthAdjust = this.props.videoChatRoomName ? 808 : 204
        let width = Math.max(500, window.innerWidth - widthAdjust);
        let height = Math.max(500, window.innerHeight - 84);

        this.game.scale.resize(
            width,
            height
        );
    }

    resizeTrigger = (timeout=500) => {
        if(this.lastResizeCall)
            clearTimeout(this.lastResizeCall)
        this.lastResizeCall = setTimeout(() => this.resizeGameWindow(), timeout)
    };

    componentDidMount = () => {
        this.game = new Phaser.Game(this.config);
        this.props.sendMessageCallback.callback = (m)=>{
            callSendMessage(m)
        }

        window.addEventListener("resize", this.resizeTrigger,false);
        setTimeout(() => this.resizeGameWindow(), 200)
    }

    componentWillUnmount() {
        window.removeEventListener(this.resizeTrigger)
    }

    lastResizeCall = null

    shouldComponentUpdate(nextProps) {
        this.resizeTrigger(50)
        if(this.game) {
            this.game.scene.getScenes(true).forEach((scene) => {
                if (nextProps.talking && scene.imTalkin)
                    scene.imTalkin()
                if (!nextProps.talking && scene.imNotTalkin)
                    scene.imNotTalkin()
            })

        }
        return false;
    }

    render() {
        return (
            <div id="phaser-game" />
        )
    }
}

let callSendMessage = (message) => {
    console.log("Can't send now: " + message)
}

// function showMessage(message) {
//     const messageSpan = document.getElementById("messageSpan")
//     messageSpan.innerText = message
//     messageSpan.style.display = "block"
//     setTimeout(() => messageSpan.style.display = "none", 3000)
// }





let worldStack = []
// const twitterUsernames = [
//     "kpgalligan",
//     "TouchlabHQ",
//     "miss_cheese",
//     "chislett",
//     "treelzebub",
//     "chethaase",
//     "jessewilson",
//     "dN0t"
// ]

// function firstPause(func, pauseTime) {
//     let lastCall = 0
//     return function () {
//         let now = Date.now();
//         if (now - lastCall > pauseTime) {
//             lastCall = now
//             func()
//         }
//     }
// }

function smooth(func, pauseTime) {
    let lastCallTime = 0

    let timeoutId = null

    let clear = function () {
        if (timeoutId != null)
            clearTimeout(timeoutId)
        timeoutId = null
    }

    let trigger = function () {
        let now = Date.now();
        let sinceLast = now - lastCallTime;
        let callFunc = () => {
            lastCallTime = now
            clear()
            func()
        }
        if (sinceLast > pauseTime) {
            callFunc()
        } else {
            clear()
            let timeoutTime = pauseTime - sinceLast
            if (timeoutTime <= 0) {
                callFunc()
            } else {
                timeoutId = setTimeout(callFunc, timeoutTime)
            }
        }
    }

    return {
        trigger: trigger,
        clear: clear
    }
}

function float(nowFunc, endfunc, pauseTime) {
    let timeoutId = null

    return function () {
        nowFunc()
        if (timeoutId != null)
            clearTimeout(timeoutId)
        timeoutId = setTimeout(function () {
            timeoutId = null
            endfunc()
        }, pauseTime)
    }
}

export default ConferenceGame