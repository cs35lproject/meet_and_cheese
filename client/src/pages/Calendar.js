import React from 'react';

import { Login } from '../components/Login';
import { handleClientLoad, handleAuthClick } from '../components/CalendarAPI';

class Calendar extends React.Component {

  constructor() {
    super();
    this.state = {
      calendarsData : null,
      events : [],
      intersections : []
    };
  }

  componentDidMount = () => {
    handleClientLoad(this.setCalendarsData);
  }

  setCalendarsData = async (tempCalendarsData, events) => {
    this.setState({calendarsData : tempCalendarsData, events : events}) 
    await new Promise(r => setTimeout(r, 500));
    this.showCalendars()
  }

  showCalendars = async () => {
    let events = this.state.events.map(event => [!isNaN(Date.parse(event.start)) ? Date.parse(event.start) : 0, !isNaN(Date.parse(event.end)) ? Date.parse(event.end) : 0])
    let body = {"events":events}
    let url = process.env.REACT_APP_BACKEND
    let metadata = {
      method: "POST",
      body: JSON.stringify(body),
      headers: {'Content-Type': 'application/json'}
    }
    fetch(url, metadata)
    .then( (res) => res.json())
    .then( (data) => {
      this.setState({intersections : data.new_intersection})
      this.updateAvailability()
    })
    .catch( (e) => {
      console.log(e)
    })
  }

  updateAvailability = async () => {
    await new Promise(r => setTimeout(r, 500));
    /* 
    use this.state.new_intersection for unix timestamps to create calendar events to represent user's availability
    */
  }

  render() {
    return (
      <React.Fragment>
        <a href="/meeting">Meeting Page</a>

        <button onClick={handleAuthClick}>Sign in</button>
        
        <button onClick={this.showCalendars}>Show Calendars</button>

        <button onClick={this.showIntersections}>Show Intersections</button>

        <Login updateUserData={this.updateUserData} />

      </React.Fragment>
    )
  }
}

export default Calendar