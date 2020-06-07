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
        talkingStart: null,
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

        return (
            <>
                <ConferenceGame
                    showVideoChat={this.showVideoChat}
                    hideVideoChat={this.hideVideoChat}
                    currentUser={this.props.currentUser}
                    currentEvent={this.props.currentEvent}
                    talking={this.state.talkingStart != null}
                    userProfileUrl={this.props.userProfileUrl}
                    startTalking={(start)=>{
                        if(this.state.talkingStart == null)
                            this.setState({talkingStart:start})
                    }}
                    cancelTalking={()=>{
                        if(this.state.talkingStart != null)
                            this.setState({talkingStart:null})
                    }}
                    sendMessageCallback={this.sendMessageCallback}
                    showMessage={(m, playerInfo) => {
                        this.state.chatMessages.push({message: m, playerInfo: playerInfo})
                        this.setState({chatMessages: this.state.chatMessages})
                    }}
                    showPlayerInfo={this.showPlayerInfo}
                />
                <GameChat
                    talking={this.state.talkingStart != null}
                    talkingStart={this.state.talkingStart}
                    /*imTalkin={() => {
                        this.setState({
                            talkingStart: ''
                        })
                    }}*/
                    imNotTalkin={() => {
                        this.setState({
                            talkingStart: null
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