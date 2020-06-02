import React from 'react'
import MainMenu from "./mainMenu";
import FirebaseAuth from "./FirebaseAuth";

function Home(props) {

    if(!props.currentUser && props.readyForAuth){
        return (
            <FirebaseAuth setCurrentUser={props.setCurrentUser} 
                          sendUserToDb={props.sendUserToDb}
                          />
        )
    } else {
        return (
            <MainMenu logout={props.logout}/>
        )
    }
}

export default Home