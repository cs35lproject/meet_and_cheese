import React from 'react';

import { Login } from '../components/Login';
import { handleClientLoad, handleAuthClick } from '../components/CalendarAPI';

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // plugin
import googleCalendarPlugin from '@fullcalendar/google-calendar'

import './style.css'

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
        <div>
          <h1>Calendar page will contain an empty calendar which will be filled in when signed in</h1>

          <h3>firstName: {this.state.firstName}</h3>
          <h3>lastName: {this.state.lastName}</h3>
          <h3>gmail: {this.state.gmail}</h3>
          <signin>
            <Login updateUserData={this.updateUserData} />
          </signin>
        </div>
        <calendar>
          <div class="square"></div>
          <FullCalendar
            plugins={[ dayGridPlugin ]}
            initialView="dayGridWeek"
            height={700}
            eventColor={'#378006'}
          />
        </calendar>
      </React.Fragment>
      
    )
  }
}

export default Calendar