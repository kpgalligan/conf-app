import React from 'react'
import EditProfile from './EditProfile'

class ProfileMenu extends React.Component {

    state = {
        displayMenu: false,
        // editMode: false
    }

    toggleDisplayMenu = () => {
        this.setState({
            displayMenu: !this.state.displayMenu
        })
    }

    // toggleEditMode = () => {
    //     this.setState({
    //         editMode: !this.state.editMode
    //     })
    //     console.log("Entering edit mode")
    // }

    render () {

        // console.log("Profile Menu props: ", this.props)

        return (
            <div className="dropdown">
                {this.props.currentUser ? 
                <div className="dropdown-button" onClick={this.toggleDisplayMenu}> {this.props.currentUser.name}'s Profile <span role="img" aria-label="triangle">🔻</span> </div> : null
                }
                
                {
                    this.state.displayMenu ? 
                    <>
                        <button> <EditProfile currentUser={this.props.currentUser} {...this.props}/> </button><br></br>
                        {/* <button onClick={this.toggleEditMode}>Edit Profile</button><br></br> */}
                        
                        <button>Log Out</button>
                    </> : null
                }
            </div>
        )

    }

}

export default ProfileMenu

