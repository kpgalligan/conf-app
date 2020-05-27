import React, {Component} from "react";
import ConferenceGame from "./ConferenceGame";
import GameChat from "./GameChat";

/**
 * Ugly callback hook. I don't understand react yet.
 */
class MessageCallback {
    constructor() {
        this.callback = (m)=>{}
    }
    send(m){
        this.callback(m)
    }
}
class GameInterface extends Component {
    constructor() {
        super();
        this.sendMessageCallback = new MessageCallback()
    }
    state = {
        talking: false,
        chatMessages:[]
    }

    render() {

        return (
            <div className="flex-container">
                <ConferenceGame
                    profileUsername={this.props.profileUsername}
                    talking={this.state.talking}
                    startTalking={()=>{
                        if(!this.state.talking)
                            this.setState({talking:true})
                    }}
                    cancelTalking={()=>{
                        if(this.state.talking)
                            this.setState({talking:false})
                    }}
                    sendMessageCallback={this.sendMessageCallback}
                    showMessage={(m, playerInfo) => {
                        this.state.chatMessages.push({message: m, playerInfo: playerInfo})
                        this.setState({chatMessages: this.state.chatMessages})
                    }}
                    findPlayerImageUrl={(playerInfo) => this.findPlayerImageUrl(playerInfo)}
                />
                <GameChat
                    talking={this.state.talking}
                    imTalkin={() => {
                        this.setState({
                            talking: true
                        })
                    }}
                    imNotTalkin={() => {
                        this.setState({
                            talking: false
                        })
                    }}
                    sendMessage={(m) => this.sendMessageCallback.send(m)}
                    chatMessages={this.state.chatMessages}
                    findPlayerImageUrl={(playerInfo) => this.findPlayerImageUrl(playerInfo)}
                />
            </div>
        )
    }

    findPlayerImageUrl(playerInfo){
        return this.userProfiles[playerInfo.profileUsername].profile
    }

    userProfiles = {
        miss_cheese: {
            profile: "https://pbs.twimg.com/profile_images/1058805611356254208/WWltCPZP_normal.jpg",
            role: "attendee"
        },
        kpgalligan: {
            profile: "https://pbs.twimg.com/profile_images/1245852692523683840/ixZ6S5RX_normal.jpg",
            role: "speaker"
        },
        TouchlabHQ: {
            profile: "https://pbs.twimg.com/profile_images/1145706250635808768/hd9OurrF_normal.png",
            role: "attendee"
        },
        chislett: {
            profile: "https://pbs.twimg.com/profile_images/514827467203162115/GLgP3dIE_normal.jpeg",
            role: "host"
        },
        treelzebub: {
            profile: "https://pbs.twimg.com/profile_images/1014302182395412480/j6SoxgVu_normal.jpg",
            role: "attendee"
        },
        chethaase: {
            profile: "https://pbs.twimg.com/profile_images/1439444409/SelfPortraitSquare_normal.jpeg",
            role: "attendee"
        },
        jessewilson: {
            profile: "https://pbs.twimg.com/profile_images/1256788744302219265/FT68FcOm_normal.jpg",
            role: "speaker"
        },
        dN0t: {
            profile: "https://pbs.twimg.com/profile_images/1099007038590468100/F_4bingS_normal.png",
            role: "attendee"
        }
    }
}

export default GameInterface