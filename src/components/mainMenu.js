import React from 'react';

class MainMenu extends React.Component {

    render () {
        return (
            <div>
                <h1 className="main">Welcome to Test Conf!</h1>
                <div className="main_menu">
                    <div className='main_menu_list'>Register</div>
                    <div className='main_menu_list'>Schedule</div>
                    <div className='main_menu_list'>Floor Plan</div>
                    <div className='main_menu_list'>Lounge</div>
                </div>    
            </div>
        ) 
    }
}

export default MainMenu