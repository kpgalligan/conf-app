import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import './App.css';
import MainMenu from './components/mainMenu'
import SignupForm from './components/SignupForm'
import LoginForm from './components/LoginForm'


class App extends React.Component {

  state = {
    currentUser: null
  }

  setCurrentUser = (user) => {
    this.setState({
      currentUser: user
    }
    // , () => {this.props.history.push("/profile")}
     // redirect to the profile page?
    )
   
  }

  render() {

    console.log(this.props)

    return (
      <div className="App">
        <header className="App-header">
          <div>
            <BrowserRouter>
              <Switch>
                <Route path="/signup" render={() => <SignupForm setCurrentUser={this.setCurrentUser} />} />
                <Route path="/login" render={() => <LoginForm setCurrentUser={this.setCurrentUser}/>} />
                <Route path="/home" render={() => <MainMenu />} />
              </Switch>
            </BrowserRouter> 
          </div>
        </header>
      </div>
    );

  }
}

export default App;
