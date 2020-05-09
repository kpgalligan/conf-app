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
    }, () => {this.props.history.push("/home")}
    )
  }

  logout = () => {
    this.setState({
      currentUser: null
    }
    // add redirect to home
    )
  }

  render() {

    console.log(this.state)

    return (
      <div className="App">
        <header className="App-header">
          <div>
            <BrowserRouter>
              <Switch>
                <Route path="/signup" render={() => <SignupForm setCurrentUser={this.setCurrentUser} />} />
                <Route path="/login" render={() => <LoginForm setCurrentUser={this.setCurrentUser}/>} />
                <Route path="/home" render={(routerProps) => <MainMenu {...routerProps}/>} />
              </Switch>
            </BrowserRouter> 
          </div>
        </header>
      </div>
    );

  }
}

export default App;
