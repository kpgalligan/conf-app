import React from 'react'

class EditProfile extends React.Component {

    render() {

        console.log("Edit profile: ", this.props)

        return (
            <div >Edit Profile</div>
            // onClick={this.props.history.push("/editprofile")}
        )
    }
}

export default EditProfile