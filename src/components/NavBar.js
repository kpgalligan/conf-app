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

    return(
        <div className="navbar">

            <NavLink to="/start" style={link}>Start Here</NavLink>
            <NavLink to="/home" style={link}>Home</NavLink>
            <NavLink to="/schedule" style={link}>Schedule</NavLink>

            {
                props.currentUser ? <ProfileMenu currentUser={props.currentUser} logout={props.logout}/> :
                null
            }
           
        </div>
    )
}

export default NavBar