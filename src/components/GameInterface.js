import React, {Component} from "react";
import ConferenceGame from "./ConferenceGame";
import GameChat from "./GameChat";
import Jitsi from "react-jitsi";
import ModalBox from "./ModalBox";
import VideoChatModal from "./VideoChatModal";

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

    state = {
        talking: false,
        chatMessages:[],
        videoChatRoomName: null,
        showPlayerProfile: null
    }

    constructor() {
        super();
        this.sendMessageCallback = new MessageCallback()
    }

    showVideoChat = (roomName) => {
        this.setState({videoChatRoomName:roomName})
        console.log("showVideoChat roomName", roomName)
    }

    hideVideoChat = () => {
        this.setState({videoChatRoomName:null})
        console.log("hideVideoChat")
    }

    showPlayerInfo = (playerId) => {
        fetch(`${process.env.REACT_APP_API_CALL}/users/${playerId}`)
        .then(response => response.json())
        .then(response => this.setState({
            showPlayerProfile: response
        }))
    }

    stopShowingPlayerInfo = () => {
        this.setState({
            showPlayerProfile: null
        })
    }

    render() {

        console.log(this.state.showPlayerProfile)

        return (
            <>
                <ConferenceGame
                    showVideoChat={this.showVideoChat}
                    hideVideoChat={this.hideVideoChat}
                    currentUser={this.props.currentUser}
                    talking={this.state.talking}
                    userProfileUrl={this.props.userProfileUrl}
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
                    showPlayerInfo={this.showPlayerInfo}
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
                    currentUser={this.props.currentUser}
                    sendMessage={(m) => this.sendMessageCallback.send(m)}
                    chatMessages={this.state.chatMessages}
                    userProfileUrl={this.props.userProfileUrl}
                />

                {this.state.videoChatRoomName ? <VideoChatModal hideVideoChat={this.hideVideoChat} videoChatRoomName={this.state.videoChatRoomName}/> : null}

                <ModalBox showPlayerProfile={this.state.showPlayerProfile} stopShowingPlayerInfo={this.stopShowingPlayerInfo}/> 
            </>
        )
    }
}

export default GameInterface