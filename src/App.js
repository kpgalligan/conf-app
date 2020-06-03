import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import './App.css';
import NavBar from './components/NavBar';
import Profile from './components/Profile';
import Schedule from './components/Schedule';
import GameInterface from "./components/GameInterface";
import {withRouter} from "react-router-dom";
import Home from "./components/Home";
import firebase from 'firebase/app';
import 'firebase/auth';



class App extends React.Component {

    state = {
        allEvents: [],
        userEvents: [],
        currentEvent: null,
        currentUser: null,
        readyForAuth: false
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
        
        firebase.auth().signOut()

        this.setState({
                currentUser: null
            }, () => this.props.history.push("/")
        )
    }

    render() {

        console.log("APP STATE: ", this.state)

        const username = this.state.currentUser ? this.state.currentUser.twitter_handle : ""
        const profileImage = this.state.currentUser ? this.state.currentUser.image_url : ""

        return (
            <div className="App">
                <div className="App-body">
                    <Router>
                        <NavBar currentUser={this.state.currentUser} logout={this.logout}/>
                        <div className="App-content">
                            <Switch>
                                <Route exact path="/" render={() => <Home
                                    currentUser={this.state.currentUser}
                                    setCurrentUser={this.setCurrentUser}
                                    sendUserToDb={this.sendUserToDb}
                                    readyForAuth={this.state.readyForAuth}
                                    currentEvent={this.state.currentEvent}
                                    allEvents={this.state.allEvents}
                                    userEvents={this.state.userEvents}
                                    ui={this.ui}
                                    logout={this.logout}/>}/>
                                <Route path="/confgame"
                                       render={() => <GameInterface userProfileUrl={this.userProfileUrl} currentUser={this.state.currentUser}/>}/>
                                <Route path="/schedule" render={() => <Schedule/>}/>
                                <Route path="/profile" render={() => <Profile history={this.props.history}
                                                                              currentUser={this.state.currentUser}
                                                                              setCurrentUser={this.setCurrentUser}/>}/>
                            </Switch>
                        </div>
                    </Router>
                </div>
            </div>
        );

    }
}

export default withRouter(App);
