import React from 'react'

class Profile extends React.Component {

    state = {
        editMode: false,
        password: this.props.currentUser.password,
        passwordConfirmation: "",
        name: this.props.currentUser.name,
        email: this.props.currentUser.email,
        company: this.props.currentUser.company,
        bio: this.props.currentUser.bio,
        twitter_handle: this.props.currentUser.twitter_handle,
        image_url: this.props.currentUser.image_url,
    }

    toggleEdit = () => {
        this.setState({
            editMode: !this.state.editMode
        })
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name] : event.target.value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault()

        if (this.state.password === this.state.passwordConfirmation) {
            
            fetch(`${process.env.REACT_APP_API_CALL}/users/${this.props.currentUser.id}`, {
                method: "PATCH",
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


    render() {

        // console.log("Profile state: ", this.state)

        return (
            <div>
                <h1>Profile Page</h1>
                <img src={this.state.image_url} alt="profile"></img>
                <h3>Name: {this.state.name}</h3>
                <h3>Company: {this.state.company}</h3>
                <h3>Bio: {this.state.bio}</h3>
                <h3>Twitter Handle: {this.state.twitter_handle}</h3>

                <button onClick={this.toggleEdit}>Update Profile</button>

                {
                    this.state.editMode ? 
                    
                    <form onSubmit={this.handleSubmit}>
                        Name: <input name="name" value={this.state.name} onChange={this.handleChange}></input> <br></br>
                        Email: <input name="email" value={this.state.email} onChange={this.handleChange} /> <br></br>
                        Company: <input name="company" value={this.state.company} onChange={this.handleChange}></input> <br></br>
                        Bio: <input name="bio" value={this.state.bio} onChange={this.handleChange}></input> <br></br>
                        Twitter Handle: <input name="twitter_handle" value={this.state.twitter_handle} onChange={this.handleChange}></input> <br></br>
                        Image URL:  <input name="image_url" value={this.state.image_url} onChange={this.handleChange}/> <br></br>
                        New password: <input name="password" value={this.state.password} type="password" onChange={this.handleChange} /> <br></br>
                        Confirm new password: <input name="passwordConfirmation" value={this.state.passwordConfirmation} type="password" onChange={this.handleChange}/> <br></br>
                        <button type="submit">Update Profile</button> 
                    </form>
                    
                    : null
                }
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                
            </div>
        )   
    }
}

export default Profile