import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import firebase from 'firebase'
// import firebase from 'firebase/app';
// import 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDw2cGjbXXA8Jax_vzsfzFFbTAeghYsd1Y",
  authDomain: "confgame-86fbe.firebaseapp.com",
  databaseURL: "https://confgame-86fbe.firebaseio.com",
  projectId: "confgame-86fbe",
  storageBucket: "confgame-86fbe.appspot.com",
  messagingSenderId: "595944067904",
  appId: "1:595944067904:web:0df1d94d6013e7656060a5",
  measurementId: "G-9EPDEFN98N"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
