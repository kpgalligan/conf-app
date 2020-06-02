import React from 'react'
import ProfileMenu from './ProfileMenu'
import { NavLink } from 'react-router-dom'

const link = {
    width: '150px',
    // padding: '12px',
    // margin: '0 6px 6px',
    color: 'white',
    align: 'left'
  }

function NavBar(props) {

    if(props.currentUser){
        return(
            <div className="navbar">
                <NavLink to="/confgame" style={link}>Game</NavLink>
                <NavLink to="/" style={link}>Home</NavLink>
                <NavLink to="/schedule" style={link}>Schedule</NavLink>
                <ProfileMenu currentUser={props.currentUser} logout={props.logout}/>
            </div>
        )
    }else {
        return (<div className="navbar"/>)
    }

}

export default NavBar