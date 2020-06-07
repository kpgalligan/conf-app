import React from 'react';
import Modal from '@material-ui/core/Modal';
import Jitsi from "react-jitsi";
import {makeStyles} from "@material-ui/core/styles";

/**
 * Jitsi is basically 720p resolution, which is 1280w x 720h. If the screen is big enough,
 * we show that exactly, or scale down to 70%. We could probably do this more adaptively, but
 * this will need to be sufficient for today.
 *
 * @returns the width
 */
function calcWidth(){
    return window.innerWidth >= 1350 ? 1280 : 896
}

function calcHeight(){
    return window.innerHeight >= 800 ? 720 : 504
}

function getModalStyle() {
    const left = calcWidth()/2 + 38;

    return {
        top: `20px`,
        left: `50%`,
        transform: `translate(-${left}px, 0px)`,
    };
}

function VideoChatModal(props) {
    const useStyles = makeStyles((theme) => ({
        paper: {
            position: 'absolute',
            backgroundColor: theme.palette.background.paper,
            border: '2px solid #000',
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
        },
    }));
    const classes = useStyles();

    const videoClosingTrigger = (api) => api.addEventListener("readyToClose", () => props.hideVideoChat())

    return (
        <div>
            <Modal
                open={props.videoChatRoomName}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <div style={getModalStyle()} className={classes.paper}>
                    <h2 id="simple-modal-title">{props.videoChatRoomName}</h2>
                    <Jitsi
                        onAPILoad={videoClosingTrigger}
                        containerStyle={{width: `${calcWidth()}px`, height: `${calcHeight()}px`}}
                        roomName={props.videoChatRoomName} displayName={props.videoChatRoomName}/>
                </div>
            </Modal>
        </div>
    );
}

export default VideoChatModal
  
  