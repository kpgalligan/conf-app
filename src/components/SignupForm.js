import React from 'react'

class SignupForm extends React.Component {

    state = {
        username: "",
        password: "",
        passwordConfirmation: ""
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault()
        // double check address to sign user up

        if (this.state.password === this.state.passwordConfirmation) {
            console.log("Sign up successful")
            // fetch('http://localhost:3000/users', {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json",
            //         "Accept": "application/json"
            //     },
            //     body: JSON.stringify({
            //         username: this.state.username,
            //         password: this.state.password
            //     })
            // })
            // .then(response => response.json())
            // .then(response => console.log(response))

        } else {
            alert("Passwords don't match")
        }

    }
    
    render () {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <input name="username" value={this.state.username} onChange={this.handleChange} placeholder="username"/>
                    <input name="password" value={this.state.password} type="password" onChange={this.handleChange} placeholder="password"/>
                    <input name="passwordConfirmation" value={this.state.passwordConfirmation} type="password" onChange={this.handleChange} placeholder="confirm password"/>
                    <button type="submit">Sign Up</button>
                </form>

            </div>
        )
    }
}

export default SignupForm