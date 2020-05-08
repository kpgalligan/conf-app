import React from 'react'

class LoginForm extends React.Component {

    state = {
        email: "",
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault()
              
        let loggedInUser
        fetch(`${process.env.REACT_APP_API_CALL}/users`)
            .then(response => response.json())
            .then(data => {
            loggedInUser = data.find(user => user.email === this.state.email)
            this.props.setCurrentUser(loggedInUser)
        }, () => console.log("Logged in OK!"))
        // this.props.navigation.navigate('Dashboard') - add redirect to the next page

    }
    
    render () {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <input name="email" value={this.state.email} onChange={this.handleChange} placeholder="Email"/>
                    {/* <input name="password" value={this.state.password} type="password" onChange={this.handleChange} placeholder="password"/> */}
                    <button type="submit">Log In</button>
                </form>

            </div>
        )
    }
}

export default LoginForm