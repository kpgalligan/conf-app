import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import './App.css';
import MainMenu from './components/mainMenu'
import SignupForm from './components/SignupForm'
import LoginForm from './components/LoginForm'


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <BrowserRouter>
            <Switch>
              <Route path="/signup" render={() => <SignupForm />} />
              <Route path="/login" render={() => <LoginForm />} />
              <Route path="/home" render={() => <MainMenu />} />
            </Switch>
          </BrowserRouter> 
        </div>
      </header>
    </div>
  );
}

export default App;
