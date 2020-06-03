import React from 'react'
import MainMenu from "./mainMenu";
import FirebaseAuth from "./FirebaseAuth";

class Home extends React.Component {

    render () {

          if (this.props.readyForAuth){

            if (!this.props.currentUser) {
                return (
                    <FirebaseAuth setCurrentUser={this.props.setCurrentUser} sendUserToDb={this.props.sendUserToDb} />
                )
            }
             else if (this.props.currentUser && !this.props.currentEvent) {
               return (
                <div>
                    Your Events:
                    <ul>
                    {
                        this.props.userEvents.map(event => {
                        return  <li key={event.id}>{event.name}</li>
                            })
                    }
                    </ul>

                    Other events you can attend:
                    <ul>
                        {
                          this.props.allEvents.filter(event => !this.props.userEvents.find(e => e.id == event.id)).map(event => {
                          return <li>{event.name}</li>
                          })
                        }
                    </ul>
                </div>
               )
    
            }
               else {
                return (
                    <MainMenu logout={this.props.logout}/>
                )
            }
        } else {
            return <div/>
        }
    }
}

export default Home