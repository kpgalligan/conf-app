import React from 'react'
import { NavLink } from 'react-router-dom'

const link = {
    width: '100px',
    // padding: '12px',
    // margin: '0 6px 6px',
    color: 'white',
    align: 'left'
  }

class ProfileMenu extends React.Component {

    state = {
        displayMenu: false
    }

    toggleDisplayMenu = () => {
        this.setState({
            displayMenu: !this.state.displayMenu
        })
    }


    render () {

        // console.log(this.props)

        return (
            <div className="dropdown">
                {this.props.currentUser ? 
                <div className="dropdown-button" onClick={this.toggleDisplayMenu}> {this.props.currentUser.name}'s Profile <span role="img" aria-label="triangle">🔻</span> </div> : null
                }
                
                {
                    this.state.displayMenu ? 
                    <>
                        <NavLink to="/profile" style={link}>Profile</NavLink>
                        <br></br>
                        <button onClick={this.props.logout}>Log Out</button>
                    </> : null
                }
            </div>
        )

    }

}

export default ProfileMenu

