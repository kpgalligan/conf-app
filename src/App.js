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
import FirebaseAuth from './components/FirebaseAuth';

class App extends React.Component {

  state = {
    currentUser: null
  }

  // componentDidMount() {
  //   const token = localStorage.token

  //   if (token) {
  //     fetch(`${process.env.REACT_APP_API_CALL}/start`, {
  //       method: "POST",
  //       headers: {
  //         "Authorization": token
  //       }
  //     })
  //     .then(response => response.json())
  //     .then(response => {
  //       if (response.errors) {
  //         alert(response.errors)
  //       } else {
  //         this.setState({
  //           currentUser: response
  //         })
  //       }
  //     })
  //   }
  // }

  // testBackend() {
   
  //   fetch("http://localhost:3000/start", {
  //     method: "POST",
  //     headers: {
  //         "Content-Type": "application/json",
  //         "Accept": "application/json"
  //     },
  //     body: JSON.stringify({
  //       uid: "1234567"
  //     })
  //   })
  //   .then(response => response.json())
    
  // }


  

  // setCurrentUser = (response) => {
  //   this.setState({
  //     currentUser: response.user
  //   }, () => {
  //     localStorage.token = response.token
  //     this.props.history.push("/home")}
  //   )
  // }

  // logout = () => {
  //   this.setState({
  //     currentUser: null
  //   }, () => {
  //     localStorage.removeItem("token")
  //     // add redirect to home - or maybe login?
  //     this.props.history.push("/login")
  //   }
    
  //   )
  // }

  render() {

    // console.log("App props: ", this.props)
    const username = this.state.currentUser ? this.state.currentUser.twitter_handle : ""
    return (
      <div className="App">
        <header className="App-header">
          <div>
            <Router>
            <NavBar currentUser={this.state.currentUser} logout={this.logout}/>
              <Switch>
                <Route path="/start" render={(props) =>  <FirebaseAuth {...props} />} />
                <Route path="/home" render={(routerProps) => <MainMenu {...routerProps} logout={this.logout}/>} />
                <Route path="/signup" render={() => <SignupForm setCurrentUser={this.setCurrentUser} />} />
                <Route path="/login" render={() => <LoginForm setCurrentUser={this.setCurrentUser}/>} />
                <Route path="/confgame" render={() => <GameInterface profileUsername={username} />} />
                <Route path="/schedule" render={() => <Schedule />} />
                <Route path="/profile" render={(props) =>  <Profile {...props} history={this.props.history} currentUser={this.state.currentUser} setCurrentUser={this.setCurrentUser}/> } />
              </Switch>
            </Router> 
          </div>
        </header>
      </div>
    );

  }
}

export default App;
