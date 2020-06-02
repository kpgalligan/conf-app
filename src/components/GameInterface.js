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
    state = {
        talking: false,
        chatMessages:[]
    }

    constructor() {
        super();
        this.sendMessageCallback = new MessageCallback()
    }

    render() {

        return (
            <>
                <ConferenceGame
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
            </>
        )
    }
}

export default GameInterface