import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './App.css';
import MainMenu from './components/mainMenu'
import SignupForm from './components/SignupForm'
import LoginForm from './components/LoginForm'
import NavBar from './components/NavBar';
import Profile from './components/Profile';
import Schedule from './components/Schedule';
import GameInterface from "./components/GameInterface";

class App extends React.Component {

  state = {
    currentUser: null
  }

  componentDidMount() {
    const token = localStorage.token

    if (token) {
      fetch(`${process.env.REACT_APP_API_CALL}/auto_login`, {
        headers: {
          "Authorization": token
        }
      })
      .then(response => response.json())
      .then(response => {
        if (response.errors) {
          alert(response.errors)
        } else {
          this.setState({
            currentUser: response
          })
        }
      })
    }
  }

  setCurrentUser = (response) => {
    this.setState({
      currentUser: response.user
    }, () => {
      localStorage.token = response.token
      this.props.history.push("/home")}
    )
  }

  logout = () => {
    this.setState({
      currentUser: null
    }, () => {
      localStorage.removeItem("token")
      // add redirect to home - or maybe login?
      this.props.history.push("/login")
    }
    
    )
  }

  render() {

    // console.log("App props: ", this.props)
    const username = this.state.currentUser ? this.state.currentUser.twitter_handle : ""
    const profileImage = this.userProfiles[username].profile

    return (
      <div className="App">
        <header className="App-header">
          <div>
            <Router>
            <NavBar currentUser={this.state.currentUser} logout={this.logout}/>
              <Switch>
                <Route path="/home" render={(routerProps) => <MainMenu {...routerProps} logout={this.logout}/>} />
                <Route path="/signup" render={() => <SignupForm setCurrentUser={this.setCurrentUser} />} />
                <Route path="/login" render={() => <LoginForm setCurrentUser={this.setCurrentUser}/>} />
                <Route path="/confgame" render={() => <GameInterface
                    profileUsername={username}
                    profileImage={profileImage}/>} />
                <Route path="/schedule" render={() => <Schedule />} />
                <Route path="/profile" render={(props) =>  <Profile {...props} history={this.props.history} currentUser={this.state.currentUser} setCurrentUser={this.setCurrentUser}/> } />
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

export default App;
