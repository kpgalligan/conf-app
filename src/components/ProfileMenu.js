import React from 'react'

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

    signout = (e) => {
        e.preventDefault()
        this.props.logout()
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
                        <a onClick={(e) => this.props.setPageInState(e, "profile")} style={link}>Profile</a>
                        <br></br>
                        <button onClick={(e) => this.signout(e)}>Log Out</button>
                    </> : null
                }
            </div>
        )

    }

}

export default ProfileMenu

