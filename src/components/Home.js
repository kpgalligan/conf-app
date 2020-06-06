import React from 'react'
import MainMenu from "./mainMenu";
import FirebaseAuth from "./FirebaseAuth";
import { Typography } from "@material-ui/core"
import Button from '@material-ui/core/Button';

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
                    <Typography variant="h3">Your Events:</Typography>
                    <ul>
                    {
                        this.props.userEvents.map(event => {
                        return  <li key={event.id}>{event.name}</li>
                            })
                    }
                    </ul>
                    <Typography variant="h3">Other events you can attend:</Typography>
                    <ul>
                        {
                          this.props.allEvents.filter(event => !this.props.userEvents.find(e => e.id === event.id)).map(event => {
                          return <li key={event.id}>{event.name}</li>
                          })
                        }
                    </ul>
                    <Button variant="contained" color="primary">
                        Hello World
                    </Button>
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