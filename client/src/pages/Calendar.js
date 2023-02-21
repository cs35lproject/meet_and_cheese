import React from 'react';

import { Login } from '../components/Login';
import { handleClientLoad, handleAuthClick } from '../components/CalendarAPI';

class Calendar extends React.Component {

  constructor() {
    super();
    this.state = {
      calendarsData : null
    };
  }

  componentDidMount = () => {
    handleClientLoad(this.setCalendarsData);
  }

  setCalendarsData = (tempCalendarsData) => {
    this.setState({calendarsData : tempCalendarsData})
  }

  showCalendars = () => {
    console.log(this.state.calendarsData)
  }

  render() {
    return (
      <React.Fragment>
        <a href="/meeting">Meeting Page</a>
        <br />

        <p>Calendar page will contain an empty calendar which will be filled in when signed in</p>

        <button onClick={handleAuthClick}>Sign in</button>
        
        <button onClick={this.showCalendars}>Show Calendars</button>

        <Login updateUserData={this.updateUserData} />

      </React.Fragment>
    )
  }
}

export default Calendar