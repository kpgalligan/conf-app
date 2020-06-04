import React from 'react';
import Modal from 'react-modal';
import Jitsi from "react-jitsi";

class VideoChatModal extends React.Component {

    videoWidth = 950
    videoHeight = 750

    videoClosingTrigger = (api) => api.addEventListener("readyToClose", () => this.props.hideVideoChat())

    render() {
        return (
            <div>
                {/* <button onClick={this.handleOpenModal}>Trigger Modal</button> */}
                <Modal
                    isOpen={this.props.videoChatRoomName}
                    ariaHideApp={false}
                    shouldCloseOnEsc={true}
                    style={
                        {
                            //   overlay: {
                            //   position: 'fixed',
                            //   width: '100px',
                            //   backgroundColor: 'rgba(255, 255, 255, 0.75)'
                            // },
                            content: {
                                // position: 'center',
                                // alignContent: 'center',
                                alignItems: 'center',
                                width: `${this.videoWidth + 20}px`,
                                height: `${this.videoHeight + 20}px`,
                                border: '1px solid #ccc',
                                background: '#fff',
                                overflow: 'auto',
                                WebkitOverflowScrolling: 'touch',
                                borderRadius: '4px',
                                outline: 'none',
                                padding: '10px'
                            }
                        }}
                    contentLabel="Player Info">

                    <Jitsi
                        onAPILoad={this.videoClosingTrigger}
                        containerStyle={{width: `${this.videoWidth}px`, height: `${this.videoHeight}px`}}
                        roomName={this.props.videoChatRoomName} displayName={this.props.videoChatRoomName}/>

                </Modal>
            </div>
        );
    }
}

export default VideoChatModal
  
  