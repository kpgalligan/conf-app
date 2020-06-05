import React from 'react';
import Modal from 'react-modal';

class ModalBox extends React.Component {
   
    handleCloseModal = () => {
      this.props.stopShowingPlayerInfo();
    }
    
    render () {
      return (
        <div>
          <Modal 
             isOpen={this.props.showPlayerProfile ? true : false}
             ariaHideApp={false}
             shouldCloseOnEsc={true}
             style={
              { 
              //   overlay: {
              //   position: 'fixed',
              //   width: '100px',
              //   backgroundColor: 'rgba(255, 255, 255, 0.75)'
              // }, 
              content: {
                // position: 'center',
                // alignContent: 'center',
                alignItems: 'center',
                width: '400px',
                height: '400px',
                border: '1px solid #ccc',
                background: '#fff',
                overflow: 'auto',
                WebkitOverflowScrolling: 'touch',
                borderRadius: '4px',
                outline: 'none',
                padding: '50px'
              } }}
             contentLabel="Player Info" >
               
               {this.props.showPlayerProfile ? 
                <>
                  <div> { this.props.showPlayerProfile.name } </div> 
                  <div> { this.props.showPlayerProfile.company || null } </div><br></br>
                  <div> { this.props.showPlayerProfile.bio || null } </div><br></br>
                  <div> { this.props.showPlayerProfile.image_url ? <img src={this.props.showPlayerProfile.image_url} height="250px" width="250px" alt="user"></img> : null }</div>
                </>
                : null}
            
            <button onClick={this.handleCloseModal}>Close</button>
          </Modal>
        </div>
      );
    }
  }
  
  export default ModalBox
  
  