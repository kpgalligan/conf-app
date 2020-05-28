import React from 'react';
import firebase from 'firebase'
import * as firebaseui from 'firebaseui'

class FirebaseAuth extends React.Component {

    componentDidMount() {
        var uiConfig = {
            // signInSuccessUrl: 'http://localhost:3001/home',
            signInFlow: 'redirect',
            callbacks: {
                signInSuccessWithAuthResult: (authResult, redirectUrl) => {
                  console.log(
                    "Avatar: ", authResult.user.photoURL, 
                    "Email: ", authResult.user.email, 
                    "Auth token: ", authResult.credential.accessToken, 
                    "Provider ID: ", authResult.credential.providerId, 
                    "User ID: ", authResult.user.uid);

                    console.log(authResult)

                // displayName
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
        
          setTimeout(() => {
            // Initialize the FirebaseUI Widget using Firebase.
          var ui = new firebaseui.auth.AuthUI(firebase.auth());
          // The start method will wait until the DOM is loaded.
          ui.start('#firebaseui-auth-container', uiConfig);
          }, 1000)
          
    }

    render () {

        console.log("Testing Firebase component")

        return (
            <div id="firebaseui-auth-container">
                <h1>Test Hello!</h1>
            </div>
        )
    }

    
}

export default FirebaseAuth