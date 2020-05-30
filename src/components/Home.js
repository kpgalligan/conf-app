import React from 'react'
import MainMenu from "./mainMenu";
import FirebaseAuth from "./FirebaseAuth";

function Home(props) {
    if(!props.currentUser){
        return (
            <FirebaseAuth setCurrentUser={props.setCurrentUser}/>
        )
    } else {
        return (
            <MainMenu logout={props.logout}/>
        )
    }
}

export default Home