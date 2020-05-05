import React from 'react'

class LoginForm extends React.Component {

    state = {
        username: "",
        password: "",
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault()
        // double check address to sign user up

        // if correct password for that user - log the user in
        if (this.state.password === this.state.passwordConfirmation) {
            console.log("Sign up successful")
        
            let loggedInUser
            fetch(`${process.env.REACT_APP_API_CALL}/users`)
                .then(response => response.json())
                .then(data => {
                loggedInUser = data.find(user => user.email === this.state.email)
                // this.props.loginUser(loggedInUser) - method to log in the user and set them as current user
            })
            // this.props.navigation.navigate('Dashboard') - add redirect to the next page
            

        } else {
            alert("Incorrect password")
        }

    }
    
    render () {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <input name="username" value={this.state.username} onChange={this.handleChange} placeholder="username"/>
                    <input name="password" value={this.state.password} type="password" onChange={this.handleChange} placeholder="password"/>
                    <button type="submit">Log In</button>
                </form>

            </div>
        )
    }
}

export default LoginForm