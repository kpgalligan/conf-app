import React, {Component} from "react";
import {AutoSizer, List} from "react-virtualized";
import TextField from "@material-ui/core/TextField";
import {Box} from "@material-ui/core";

class GameChat extends Component {
    state = {
        commentString: ""
    }

    render() {
        const commentString = document.getElementById("commentString")
        if (commentString) {
            if (this.props.talking)
                setTimeout(() => commentString.focus(), 2)
            else
                setTimeout(() => commentString.blur(), 2)
        }

        const rowRenderer = ({index, isScrolling, key, style}) => {
            const imgUrl = this.props.userProfileUrl(this.props.chatMessages[index].playerInfo.id)
            return (
                <div key={key}>
                    <Box>
                    <img src={imgUrl} alt="player"/>
                    {this.props.chatMessages[index].message.message}
                    </Box>
                </div>
            );
        };

        return (
            <div id="chatContainer">
                <div className="chatArea">
                    <AutoSizer>
                        {({height, width}) => {
                            return (
                                <List
                                    rowCount={this.props.chatMessages.length}
                                    width={340}
                                    height={height}
                                    rowHeight={100}
                                    rowRenderer={rowRenderer}
                                    overscanRowCount={3}
                                />

                            )
                        }
                        }

                    </AutoSizer>
                </div>
                <TextField
                    id="commentString"
                    name="commentString"
                    label="Comment"
                    variant="outlined"
                    disabled={!this.props.talking}
                    onFocus={this.inputFocus}
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

    inputFocus = () => {
        this.setState({
            commentString: this.props.talkingStart
        })
        // this.props.imTalkin()
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