import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import './App.css';
import NavBar from './components/NavBar';
import Profile from './components/Profile';
import Schedule from './components/Schedule';
import GameInterface from "./components/GameInterface";
import {withRouter} from "react-router-dom";
import Home from "./components/Home";

class App extends React.Component {

    state = {
        currentUser: null
    }

    setCurrentUser = (response) => {
        this.setState({
                currentUser: response.user
            }
        )
    }

    logout = () => {
        this.setState({
                currentUser: null
            }, () => {
                // localStorage.removeItem("token")
                // add redirect to home - or maybe login?
                this.props.history.push("/start")
            }
        )
    }

    render() {

        console.log("App state: ", this.state)

        const username = this.state.currentUser ? this.state.currentUser.twitter_handle : ""

        return (
            <div className="App">
                <header className="App-header">
                    <div>
                        <Router>
                            <NavBar currentUser={this.state.currentUser} logout={this.logout}/>
                            <Switch>
                                <Route exact path="/" render={() => <Home
                                    currentUser={this.state.currentUser}
                                    setCurrentUser={this.setCurrentUser}
                                    logout={this.logout}/>}/>
                                <Route path="/confgame" render={() => <GameInterface profileUsername={username}/>}/>
                                <Route path="/schedule" render={() => <Schedule/>}/>
                                <Route path="/profile" render={() => <Profile history={this.props.history}
                                                                              currentUser={this.state.currentUser}
                                                                              setCurrentUser={this.setCurrentUser}/>}/>
                            </Switch>
                        </Router>
                    </div>
                </header>
            </div>
        );

    }
}

export default withRouter(App);
