import React from 'react';
import './App.css';
import NavBar from './components/NavBar';
import Profile from './components/Profile';
import Schedule from './components/Schedule';
import GameInterface from "./components/GameInterface";
import Home from "./components/Home";
import firebase from 'firebase/app';
import 'firebase/auth';



class App extends React.Component {

    state = {
        allEvents: [],
        userEvents: [],
        currentEvent: null,
        currentUser: null,
        readyForAuth: false,
        page: "home"
    }


    componentDidMount() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.sendUserToDb(user)
            } else {
                this.setState({
                    readyForAuth: true
                })
            }
          });

        fetch('http://localhost:3000/events')
        .then(response => response.json())
        .then(response => this.setState({
            allEvents: response
        }))
    }

    userProfileUrl(id) {
        return `${process.env.REACT_APP_API_CALL}/image?id=${id}`
    }

    sendUserToDb = (user, credential) => {

        fetch(`${process.env.REACT_APP_API_CALL}/start`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
              email: user.email,
              name: user.displayName,
              uid: user.uid,
              auth_provider: credential ? credential.providerId : null,
              auth_token: credential ? credential.accessToken : null,
              image_url: user.photoURL
            })
        })
        .then(response => response.json())
        .then(response => {
            if (response.errors) {
                alert(response.errors)
                console.log("Error response: ", response)
            } else {
                this.setCurrentUser(response)
                console.log("Response: ", response)
            }
            this.setState({
                readyForAuth: true
            })
        })
    }

    setCurrentUser = (response) => {
        // console.log("RESPONSE: ", response)
        this.setState({
                currentUser: response.user,
                userEvents: response.events
            }
        )
    }



    logout = () => {
        console.log("Logging out")
        firebase.auth().signOut()

        this.setState({
                currentUser: null,
                page: "home"
            }
        )
    }

    pageLayout = () =>  {

        if (this.state.page === "home") {
            return <Home
            currentUser={this.state.currentUser}
            setCurrentUser={this.setCurrentUser}
            sendUserToDb={this.sendUserToDb}
            readyForAuth={this.state.readyForAuth}
            currentEvent={this.state.currentEvent}
            allEvents={this.state.allEvents}
            userEvents={this.state.userEvents}
            ui={this.ui}
            logout={this.logout}/>
        } 
        if (this.state.page === "game") {
            return <GameInterface userProfileUrl={this.userProfileUrl} currentUser={this.state.currentUser}/>
        }

        if (this.state.page === "schedule") {
            return <Schedule/>
        }

        if (this.state.page === "profile") {
            return <Profile history={this.props.history}
            currentUser={this.state.currentUser}
            setCurrentUser={this.setCurrentUser}/>
        }
    } 

    setPageInState = (e, targetPage) => {
        e.preventDefault()
        this.setState({
            page: targetPage
        })
    }

    render() {

        console.log("APP STATE: ", this.state)

        const username = this.state.currentUser ? this.state.currentUser.twitter_handle : ""
        const profileImage = this.state.currentUser ? this.state.currentUser.image_url : ""

    

        return (
            <div className="App">
                <div className="App-body">
                    
                        <NavBar currentUser={this.state.currentUser} logout={this.logout} setPageInState={this.setPageInState}/>
                        <div className="App-content">

                        {this.pageLayout()}
                       
                
                            
                        </div>
                    
                </div>
            </div>
        );

    }
}

export default App
