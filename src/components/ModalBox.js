import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';

function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

function ModalBox(props) {

    const useStyles = makeStyles((theme) => ({
        paper: {
            position: 'absolute',
            width: 400,
            backgroundColor: theme.palette.background.paper,
            border: '2px solid #000',
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
        },
    }));
    const classes = useStyles();

    return (

        <Modal
            open={props.showPlayerProfile}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            <div style={getModalStyle()} className={classes.paper}>
                    {props.showPlayerProfile ?
                        <>
                            <h2 id="simple-modal-title">{props.showPlayerProfile.name}</h2>
                            <p id="simple-modal-description"> { props.showPlayerProfile.name } <br/>
                             { props.showPlayerProfile.company || null } <br/>
                             { props.showPlayerProfile.bio || null } <br/>
                             { props.showPlayerProfile.image_url ? <img src={props.showPlayerProfile.image_url} height="250px" width="250px" alt="user"></img> : null }
                            </p>
                        </>
                        : null}

                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => props.stopShowingPlayerInfo()}
                >
                    Close
                </Button>
            </div>
        </Modal>
    );
}

export default ModalBox

  