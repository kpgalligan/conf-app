import React from 'react'
import ProfileMenu from './ProfileMenu'

const link = {
    width: '150px',
    // padding: '12px',
    // margin: '0 6px 6px',
    color: 'white',
    align: 'left'
  }

function NavBar(props) {

    if (props.currentUser){

        return(
            <div className="navbar">
                <a href="/game" className="navlink" onClick={(e) => props.setPageInState(e, "game")} style={link}>Game</a>
                <a href="/home" className="navlink" onClick={(e) => props.setPageInState(e, "home")} style={link}>Home</a>
                <a href="/schedule" className="navlink" onClick={(e) => props.setPageInState(e, "schedule")} style={link}>Schedule</a>
                <ProfileMenu currentUser={props.currentUser} logout={props.logout} setPageInState={props.setPageInState}/>
            </div>
        )
    } else {
        return (<div className="navbar"/>)
    }

}

export default NavBar