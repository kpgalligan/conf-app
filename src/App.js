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
      const profileImage = this.userProfiles[username].profile
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
                                <Route path="/confgame" render={() => <GameInterface profileUsername={username} profileImage={profileImage}/>}/>}/>
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

  userProfiles = {
    miss_cheese: {
      profile: "https://pbs.twimg.com/profile_images/1058805611356254208/WWltCPZP_normal.jpg",
      role: "attendee"
    },
    kpgalligan: {
      profile: "https://pbs.twimg.com/profile_images/1245852692523683840/ixZ6S5RX_normal.jpg",
      role: "speaker"
    },
    TouchlabHQ: {
      profile: "https://pbs.twimg.com/profile_images/1145706250635808768/hd9OurrF_normal.png",
      role: "attendee"
    },
    chislett: {
      profile: "https://pbs.twimg.com/profile_images/514827467203162115/GLgP3dIE_normal.jpeg",
      role: "host"
    },
    treelzebub: {
      profile: "https://pbs.twimg.com/profile_images/1014302182395412480/j6SoxgVu_normal.jpg",
      role: "attendee"
    },
    chethaase: {
      profile: "https://pbs.twimg.com/profile_images/1439444409/SelfPortraitSquare_normal.jpeg",
      role: "attendee"
    },
    jessewilson: {
      profile: "https://pbs.twimg.com/profile_images/1256788744302219265/FT68FcOm_normal.jpg",
      role: "speaker"
    },
    dN0t: {
      profile: "https://pbs.twimg.com/profile_images/1099007038590468100/F_4bingS_normal.png",
      role: "attendee"
    }
  }
}

export default withRouter(App);
