import React from 'react';
import firebase from 'firebase';
import * as firebaseui from 'firebaseui';
import '../FirebaseAuth.css';


class FirebaseAuth extends React.Component {

    componentDidMount() {
        var uiConfig = {
            // signInSuccessUrl: 'http://localhost:3001/home',
            signInFlow: 'popup',
            callbacks: {
                signInSuccessWithAuthResult: (authResult) => {
                  this.props.sendUserToDb(authResult.user, authResult.credential)
                  return false;
                },
              },
            signInOptions: [
              // Leave the lines as is for the providers you want to offer your users.
              firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            //   firebase.auth.TwitterAuthProvider.PROVIDER_ID,
              firebase.auth.GithubAuthProvider.PROVIDER_ID,
              firebase.auth.EmailAuthProvider.PROVIDER_ID,
             
            ],
            // tosUrl and privacyPolicyUrl accept either url string or a callback
            // function.
            // Terms of service url/callback.
            tosUrl: 'http://example.com',
            // Privacy policy url/callback.
            privacyPolicyUrl: function() {
              window.location.assign('http://example.com');
            }
          };

          const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth());
          ui.start('#firebaseui-auth-container', uiConfig)
        
    }

    render () {

      console.log(this.props)

        return (
            <div id="firebaseui-auth-container">
                <h1>Welcome! Please sign up/log in.</h1>
            </div>
        )
    }

    
}

export default FirebaseAuth