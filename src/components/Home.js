import React from 'react'
import MainMenu from "./mainMenu";
import FirebaseAuth from "./FirebaseAuth";

function Home(props) {

    if (props.readyForAuth){

        if (!props.currentUser) {
            return (
                <FirebaseAuth setCurrentUser={props.setCurrentUser} 
                              sendUserToDb={props.sendUserToDb} />
            )
        } else if (props.currentUser // && props.currentUser doesn't have an event
        ) {
            // show events
        } else {
            return (
                <MainMenu logout={props.logout}/>
            )
        }
    }
}

export default Home