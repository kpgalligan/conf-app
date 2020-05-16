import React from 'react';
// import '../App.css';

class MainMenu extends React.Component {

    render () {
        return (
            <div>
                <h1>Welcome to Test Conf!</h1>
                <div className='main_menu_list'>Register</div>
                <div className='main_menu_list'>Schedule</div>
                <div className='main_menu_list'>Floor Plan</div>
                <div className='main_menu_list'>Lounge</div>
                <br></br>
                <br></br>
                <button className='main_menu_list' onClick={this.props.logout}> Log Out </button>
            </div>
        ) 
    }
}

export default MainMenu