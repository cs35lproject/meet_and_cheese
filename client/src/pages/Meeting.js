import React from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // plugin
import googleCalendarPlugin from '@fullcalendar/google-calendar'
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

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
      fullcalendarEvents : [],
      savedEvents: {},// event_id : [start, end]
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
          id: uuidv4(),
          saved: false,
        };
        _events.push(_event);
      }
      this.setState({fullcalendarEvents: _events, intersections : this.props.intersections, meetingID : this.props.meetingID, meetingMemberIDS : this.props.meetingMemberIDS})
    }
  }

  handleEventClick = (arg) => {
    //console.log("start: ", arg.event.start," end: ", arg.event.end, " title: ", arg.event.title, " id: ", arg.event.id)
    const saved_events = {...this.state.savedEvents };
    if (arg.event.extendedProps.saved) {
      console.log("unsaved");
      arg.event.setExtendedProp("saved", false);
      arg.event.setProp("backgroundColor", "green");
      delete saved_events[arg.event.id];
    }
    else {
      console.log("saved")
      arg.event.setExtendedProp("saved", true);
      arg.event.setProp("backgroundColor", "red");
      saved_events[arg.event.id] = [arg.event.start, arg.event.end];
    }
    this.setState({ savedEvents: saved_events });
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
    console.log(this.state.fullcalendarEvents)
    console.log(this.props.intersections)
  }

  checkSavedEvents = () => {
    console.log(this.savedEvents);
    for (let event_id in this.state.savedEvents) {
      //console.log("event id: ", event_id);
      console.log("event data: ", this.state.savedEvents[event_id]);
    }
  }

  render() {
    console.log("INSIDE MEETING ON NEW ADDITION, CALLED RENDER")
    return (
      <React.Fragment>
        <div>
          <Navbar handleAuthClick = {handleAuthClick}/>
        </div>

        <button onClick={this.checkData}>check data</button>
        <button onClick={this.checkSavedEvents}>check saved events</button>

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
            events ={this.state.fullcalendarEvents}
            editable={true} // allows both resizing and dragging
            eventDurationEditable={true}
            eventResizableFromStart={true}
            eventDrop={this.handleEventDrop}
          />
        </calendar>
  
        </React.Fragment>
    )
  }
}

export default Meeting