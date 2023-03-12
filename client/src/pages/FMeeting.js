import { useState, useEffect } from 'react';
import React from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // plugin
import googleCalendarPlugin from '@fullcalendar/google-calendar'
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useLocation, useSearchParams } from 'react-router-dom';

import { handleAuthClick, config } from '../components/CalendarAPI';
import Navbar from "../components/Navbar"
import './style.css';

export default function FMeeting(props) {
    const { state } = useLocation()
    const [searchParams] = useSearchParams();
    const [meetingID, setMeetingID] = useState(state ? state.meetingID : null);
    const [intersections, setIntersections] = useState(state ? state.intersections : null);
    const [meetingMemberIDS, setMeetingMemberIDS] = useState(null);
    const [eventsArray, setEventsArray] = useState([]);
    const [minTime, setMinTime] = useState('06:00:00');
    const [endTime, setEndTime] = useState('22:00:00');

  const handleStartChange = (event) => {
    setMinTime(event.target.value);
  }

  const handleEndChange = (event) => {
    setEndTime(event.target.value);
  }

  const handleEventClick = (arg) => {
    console.log("start: ", arg.event.start," end: ", arg.event.end, " title: ", arg.event.title)
  }

  const handleMouseEnter = (arg) => {
    arg.el.classList.add('event_hover'); // Add custom class on mouse enter
  }

  const handleMouseLeave = (arg) => {
    arg.el.classList.remove('event_hover'); // Add custom class on mouse enter
  }

  useEffect(() => {
    loadValues()
  }, [intersections])

  useEffect(() => {
    if (intersections === null) {
        findMeeting()
    } else {
        loadValues()
    }
  }, []);

  const findMeeting = async () => {
    const meetingID = searchParams.get("id");
    let url = `${process.env.REACT_APP_GET_MEETING}?id=${meetingID}`
    let metadata = { method: "GET" }
    try {
        const response = await fetch(url, metadata)
        const data = await response.json()
        if (data.meeting !== undefined) {
            setMeetingID(data.meeting.meetingID);
            setIntersections(data.meeting.meeting.intersections);
            setMeetingMemberIDS(data.meeting.meeting.meetingMemberIDS);
        }
    } catch (error) {
        console.log(error);
    }
  }

  const loadValues = async () => {
    await new Promise(r => setTimeout(r, 100));
    if (intersections) {
      let _events = [];
      const timeNow = Date.now();
      for (const start_end of intersections) {
        if (start_end[0] < timeNow) continue;
        const _event = {
          title: "Available",
          start: start_end[0],
          end: start_end[1],
        };
        _events.push(_event);
        setEventsArray(_events);
        setMeetingID(meetingID);
        setMeetingMemberIDS(meetingMemberIDS);
      }
    }
  }
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
            value={minTime}
            onChange={handleStartChange}
          />

          <label htmlFor="end-time-input"></label>
          <input
            id="end-time-input"
            type="time"
            value={endTime}
            onChange={handleEndChange}
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
            eventClick={handleEventClick}
            eventMouseEnter={handleMouseEnter}
            eventMouseLeave={handleMouseLeave}
            handleWindowResize={true}
            slotMinTime={minTime}
            slotMaxTime={endTime}
            events ={eventsArray}
            //editable={true} // allows both resizing and dragging
            eventDurationEditable={true}
            eventResizableFromStart={true}
          />
        </calendar>
  
        </React.Fragment>
  )
}