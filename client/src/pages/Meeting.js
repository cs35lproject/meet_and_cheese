import React from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // plugin
import googleCalendarPlugin from '@fullcalendar/google-calendar'
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useLocation } from 'react-router-dom';

import { handleAuthClick, config } from '../components/CalendarAPI';
import Navbar from "../components/Navbar"
import './style.css';

const withRouter = Meeting => props => {
  const location = useLocation()
  console.log("showMeeting location:", location)
  console.log("showMeeting props:", props)
  return (
    <Meeting
    {...props}
    {...{location}}
    />
  )
}

class Meeting extends React.Component {

  constructor() {
    super();
    this.state = {
      meetingID : [],
      intersections : [],
      meetingMemberIDS : [],
      eventsArray : [],
      minTime: '06:00:00',
      endTime: '22:00:00',
    }
    this.handleStartChange = this.handleStartChange.bind(this);
    this.handleEndChange = this.handleEndChange.bind(this);
  }

  componentDidMount() {
    console.log("componentDidMount() inside Meeting.js, props", this.props)
    
    console.log("componentDidMount() Meeting.js")
    this.loadValues()
  }

  loadValues = async () => {
    await new Promise(r => setTimeout(r, 100));
    console.log("loadValues(), props:", this.state.props)
    if (this.props.intersections) {
      let _events = [];
      const timeNow = Date.now();
      console.log("Time now: ", timeNow);
      for (const start_end of this.props.intersections) {
        console.log("start_end:", start_end[0], start_end[1])
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
      this.setState({eventsArray: _events, intersections : this.props.intersections, meetingID : this.props.meetingID, meetingMemberIDS : this.props.meetingMemberIDS})
    }
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

  checkData = () => {
    console.log("this.state:", this.state)
    return
    console.log(this.state.intersections)
    console.log(this.state.eventsArray)
    console.log(this.props.intersections)
  }

  render() {
    console.log("INSIDE MEETING ON NEW ADDITION, CALLED RENDER")
    return (
      <React.Fragment>
        <div>
          <Navbar handleAuthClick = {handleAuthClick}/>
        </div>

        <button onClick={this.checkData}>check data</button>

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

export default Meeting