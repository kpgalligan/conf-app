import React from 'react';
import firebase from 'firebase';
import * as firebaseui from 'firebaseui';
import { withRouter } from "react-router-dom";

class FirebaseAuth extends React.Component {

    componentDidMount() {
        var uiConfig = {
            // signInSuccessUrl: 'http://localhost:3001/home',
            signInFlow: 'redirect',
            callbacks: {
                signInSuccessWithAuthResult: (authResult) => {
                  this.handleSubmit(authResult)
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
          }, 100) 
    }

    handleSubmit = (authResult) => {

        fetch(`${process.env.REACT_APP_API_CALL}/start`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
              email : authResult.user.email,
              name : authResult.user.displayName,
              uid : authResult.user.uid,
              auth_provider : authResult.credential.providerId,
              auth_token : authResult.credential.accessToken,
              image_url : authResult.user.photoURL
            })
        })
        .then(response => response.json())
        .then(response => {
            if (response.errors) {
                alert(response.errors)
                console.log("Error response: ", response)
            } else {
                this.props.setCurrentUser(response)
                console.log("Response: ", response)
            }
        })

      
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

export default withRouter(FirebaseAuth)