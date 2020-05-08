import React from 'react'

class SignupForm extends React.Component {

    state = {
        name: "",
        company: "",
        email: "",
        password: "",
        passwordConfirmation: "",
        twitter_handle: "",
        
        image_url: "",
        bio: ""
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
            // console.log("Sign up successful")
            fetch(`${process.env.REACT_APP_API_CALL}/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    name: this.state.name,
                    email: this.state.email,
                    twitter_handle: this.state.twitter_handle,
                    company: this.state.company,
                    image_url: this.state.image_url,
                    bio: this.state.bio,
                    password: this.state.password
                })
            })
            .then(response => response.json())
            .then(response => {
                if (response.errors) {
                    alert(response.errors)
                } else {
                    this.props.setCurrentUser(response)
                }
            })

        } else {
            alert("Passwords don't match")
        }

    }
    
    render () {

        // console.log(this.state)

        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <input name="name" value={this.state.name} onChange={this.handleChange} placeholder="Name"/> <br></br>
                    <input name="email" value={this.state.email} onChange={this.handleChange} placeholder="Email"/> <br></br>
                    <input name="password" value={this.state.password} type="password" onChange={this.handleChange} placeholder="Password"/> <br></br>
                    <input name="passwordConfirmation" value={this.state.passwordConfirmation} type="password" onChange={this.handleChange} placeholder="Confirm Password"/> <br></br>
                    <input name="twitter_handle" value={this.state.twitter_handle} onChange={this.handleChange} placeholder="Twitter Handle"/> <br></br>
                    <input name="company" value={this.state.company} onChange={this.handleChange} placeholder="Company"/> <br></br>
                    <input name="bio" value={this.state.bio} onChange={this.handleChange} placeholder="Bio"/> <br></br>
                    <input name="image_url" value={this.state.image_url} onChange={this.handleChange} placeholder="Image URL"/> <br></br>
                    <button type="submit">Sign Up</button>
                </form>

            </div>
        )
    }
}

export default SignupForm