import React from 'react';

import { handleClientLoad, handleAuthClick, config } from '../components/CalendarAPI';

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // plugin
import googleCalendarPlugin from '@fullcalendar/google-calendar'
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Navbar from "../components/Navbar"

import './style.css'
import ReactDOM from 'react-dom';
import Meeting from './Meeting';
import { handleClientLoad, handleAuthClick } from '../components/CalendarAPI';

class Calendar extends React.Component {

  constructor() {
    super();
    this.state = {
      calendarsData : null,
      events : [],
      intersections : [],
      eventsArray : [],
      minTime: '06:00:00',
      endTime: '22:00:00',
      meetingID : null,
      meetingMemberIDS : null
    };
    this.handleStartChange = this.handleStartChange.bind(this);
    this.handleEndChange = this.handleEndChange.bind(this);
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
    console.log("this.state.calendardata:", this.state.calendarsData)
    let body = {"_id" : "SECOND ID TEST", "events" : events}
    let url = process.env.REACT_APP_BACKEND
    let metadata = {
      method: "POST",
      body: JSON.stringify(body),
      headers: {'Content-Type': 'application/json'}
    }
    fetch(url, metadata)
    .then( (res) => res.json())
    .then( (data) => {
      console.log("data:", data)
      if (data.meeting !== undefined) {
        this.setState({meetingID : data.meeting.meetingID, intersections : data.meeting.meeting.intersections, meetingMemberIDS : data.meeting.meeting.meetingMemberIDS})
        if (data.meeting.meetingID !== undefined) {
          window.location = ('/meeting?id='+data.meeting.meetingID)
        }
      }
    })
    .catch( (e) => {
      console.log(e)
    })
  }

  updateAvailability = async () => {
    await new Promise(r => setTimeout(r, 500));
    let _events = [];
    const timeNow = Date.now();
    console.log("Time now: ", timeNow);
    for (const start_end of this.state.intersections) {
      // only dates STARTING from TODAY
      // if end time is less than time now, get rid of the event
      if (start_end[0] < timeNow) continue;
      const _event = {
        title: "Available",
        start: start_end[0],
        end: start_end[1],
      };
      _events.push(_event);
    }
    this.setState({ eventsArray: _events });
    /* 
    use this.state.new_intersection for unix timestamps to create calendar events to represent user's availability
    */
  }

  handleEventClick = (arg) => {
    console.log("start: ", arg.event.start," end: ", arg.event.end, " title: ", arg.event.title)
  }

  
  handleMouseEnter = (arg) => {
    arg.el.classList.add('event_hover'); // Add custom class on mouse enter
  }

  handleMouseLeave = (arg) => {
    arg.el.classList.remove('event_hover'); // Add custom class on mouse enter
  }

  handleStartChange(event) {
    this.setState({ minTime: event.target.value });
  }

  handleEndChange(event) {
    this.setState({ endTime: event.target.value });
  }

  render() {
    if (this.state.intersections) {
      return (
        <React.Fragment>
          <Meeting meetingID={this.state.meetingID} intersections={this.state.intersections} meetingMemberIDS={this.state.meetingMemberIDS} />
        </React.Fragment>
      )
    }
    else {
      return (
        <React.Fragment>
        <div>
          <Navbar handleAuthClick = {handleAuthClick}/>
        </div>

        <div>
          <label htmlFor="start-time-input"></label>
          <input
            id="start-time-input"
            type="time"
            value={this.state.minTime}
            onChange={this.handleStartChange}
          />


          <label htmlFor="end-time-input"></label>
          <input
            id="end-time-input"
            type="time"
            value={this.state.endTime}
            onChange={this.handleEndChange}
          />
        </div>

        <calendar>
          <div class="square"></div>
          <FullCalendar
            plugins={[ dayGridPlugin, googleCalendarPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            allDaySlot={false}
            eventColor={'#378006'}
            googleCalendarApiKey={config.apiKey}
            // auto gets rid of need for scrolling for contentHeight
            //contentHeight="auto" 
            height={700}
            eventClick={this.handleEventClick}
            eventMouseEnter={this.handleMouseEnter}
            eventMouseLeave={this.handleMouseLeave}
            handleWindowResize={true}
            slotMinTime={this.state.minTime}
            slotMaxTime={this.state.endTime}
            events ={this.state.eventsArray}
            //editable={true} // allows both resizing and dragging
            eventDurationEditable={true}
            eventResizableFromStart={true}
          />
        </calendar>
  
        </React.Fragment>
      )
    }

  }
}

export default Calendar