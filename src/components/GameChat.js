import React, {Component} from "react";
import {FixedSizeList as List} from "react-window";

class GameChat extends Component {
    state = {
        commentString: ""
    }

    render() {
        const commentString = document.getElementById("commentString")
        if (commentString) {
            if (this.props.talking)
                setTimeout(() => commentString.focus(), 200)
            else
                setTimeout(() => commentString.blur(), 200)
        }

        const Row = ({index, style}) => {
            const imgUrl = this.props.chatMessages[index].playerInfo.profileImage
            console.log("this.props.chatMessages", this.props.chatMessages)
            return (
            <div className={index % 2 ? "ListItemOdd" : "ListItemEven"} style={style}>
                <img src={imgUrl} alt="player"/>
                {this.props.chatMessages[index].message.message}
            </div>
        )
        }

        return (
            <div id="chatContainer">
                <div className="chatArea">
                    <List
                        className="List"
                        height={500}
                        itemCount={this.props.chatMessages.length}
                        itemSize={35}
                        width={200}
                    >
                        {Row}
                    </List>
                </div>
                <input
                    id="commentString"
                    disabled={!this.props.talking}
                    name="commentString"
                    placeholder="Type here..."
                    type="text"
                    onFocus={this.props.imTalkin}
                    onBlur={this.inputBlur}
                    value={this.state.commentString}
                    onKeyDown={this._handleKeyDown}
                    onChange={this.handleChange}
                />
            </div>
        )
    }

    _handleKeyDown = (e) => {
        console.log("this.state.commentString", this.state.commentString)
        if (e.key === 'Enter') {
            if (this.state.commentString.length > 0) {
                this.props.sendMessage(this.state.commentString)
                this.setState({commentString: ""})
            }
            e.target.blur()
        }
    }

    inputBlur = () => {
        this.setState({
            commentString: ""
        })
        this.props.imNotTalkin()
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
}

export default GameChat