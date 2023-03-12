import React, { useEffect } from 'react';

import { handleClientLoad, handleAuthClick, config } from '../components/CalendarAPI';

import { useNavigate } from 'react-router-dom'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // plugin
import googleCalendarPlugin from '@fullcalendar/google-calendar'
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import Navbar from "../components/Navbar"
import './style.css'

const CreateMeeting = (props) => {
  const navigate = useNavigate()
  useEffect(() => {
    console.log("createMeeting props:", props)
    navigate(`/meeting?id=${props.meetingID}`, {state: { meetingID : props.meetingID, intersections : props.intersections, meetingMemberIDS : props.meetingMemberIDS }})
    console.log("Finished createMeeting")
  })
}

class Calendar extends React.Component {

  constructor() {
    super();
    this.state = {
      calendarsData : null,
      events : [],
      intersections : [],
      //minTime: '06:00:00',
      //endTime: '22:00:00',
      meetingID : null,
      meetingMemberIDS : null
    };
  }

  componentDidMount = () => {
    console.log("calling the old calendar.js")
    handleClientLoad(this.setCalendarsData);
  }

  setCalendarsData = async (tempCalendarsData, events) => {
    this.setState({calendarsData : tempCalendarsData, events : events}) 
    await new Promise(r => setTimeout(r, 500));
    this.showCalendars()
  }

  showCalendars = async () => {
    console.log("CALLING OLD CALENDAR")
    let events = this.state.events.map(event => [!isNaN(Date.parse(event.start)) ? Date.parse(event.start) : 0, !isNaN(Date.parse(event.end)) ? Date.parse(event.end) : 0])
    console.log("this.state.calendardata:", this.state.calendarsData)
    let body = {"_id" : "SECOND ID TEST", "events" : events}
    let url = process.env.REACT_APP_CREATE_MEETING
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
        console.log("finding meetingMemberIDs:", data.meeting.meeting)
        console.log("finding meetingMemberIDs:", Object.keys(data.meeting.meeting))
        this.setState({meetingID : data.meeting.meetingID, intersections : data.meeting.meeting.intersections, meetingMemberIDS : data.meeting.meeting.meetingMemberIDS})
      }
    })
    .catch( (e) => {
      console.log(e)
    })
  }

  render() {
    if (this.state.meetingID !== null && this.state.intersections !== null && this.state.meetingMemberIDS !== null) {
      console.log("calendar.js this.state:", this.state)
      return (
        <CreateMeeting meetingID={this.state.meetingID} intersections={this.state.intersections} meetingMemberIDS={this.state.meetingMemberIDS} />
      )
    }
    else {
      return (
        <React.Fragment>
        <div>
          <Navbar handleAuthClick = {handleAuthClick}/>
        </div>

        <calendar>
          <div class="square"></div>
          <FullCalendar
            plugins={[ dayGridPlugin, googleCalendarPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            allDaySlot={false}
            eventColor={'#378006'}
            googleCalendarApiKey={config.apiKey}
            height={700}
            handleWindowResize={true}
            //slotMinTime={this.state.minTime}
            //slotMaxTime={this.state.endTime}
          />
        </calendar>
  
        </React.Fragment>
      )
    }

  }
}

export default Calendar