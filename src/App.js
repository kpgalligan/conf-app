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
