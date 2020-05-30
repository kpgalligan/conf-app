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
                    profileImage={this.props.profileImage}
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
                />
            </div>
        )
    }
}

export default GameInterface