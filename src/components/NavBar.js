import React from 'react'
import ProfileMenu from './ProfileMenu'

function NavBar(props) {

    console.log("Navbar Props: ", props)

    return(
        <div className="navbar">

            <div className="top">
                <h5>Conference Name</h5>
                <h5><ProfileMenu currentUser={props.currentUser}/> </h5>
            </div>

            {/* <div className="bottom"></div> */}
        </div>
    )
}

export default NavBar