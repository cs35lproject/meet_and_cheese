import { useLocation, useSearchParams, useNavigate, createSearchParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // plugin
import googleCalendarPlugin from '@fullcalendar/google-calendar'
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { v4 as uuidv4 } from 'uuid';

import { handleAuthClick, config, formatEvent, handleClientLoad } from '../components/CalendarAPI';
import Navbar from "../components/Navbar"
import './style.css';

export default function Meeting() {
    const navigate = useNavigate()
    const { state } = useLocation()
    const [searchParams] = useSearchParams();
    const [meetingOrganizer, setMeetingOrganizer] = useState(state ? state.organizer : null);
    const [userID, setUserID] = useState(!!localStorage.getItem("userID") ? localStorage.getItem("userID") : null);
    const [meetingID, setMeetingID] = useState(state ? state.meetingID : null);
    const [intersections, setIntersections] = useState(state ? state.availability : null);
    const [meetingMemberIDs, setMeetingMemberIDs] = useState(state ? state.meetingMemberIDs : null);
    const [eventsArray, setEventsArray] = useState([]);
    const [minTime, setMinTime] = useState('06:00:00');
    const [endTime, setEndTime] = useState('22:00:00');
    const [savedEvents, setSavedEvents] = useState({});

    useEffect(() => {
      console.log("meeting a")
        loadValues()
    }, [intersections])

    useEffect(() => {
      if (!userID && localStorage.getItem("userID")) setUserID(localStorage.getItem("userID"))
      handleClientLoad(setupCalendarEvent)
      // If users came from Calendar page, intersections Hook would have availability
      if (intersections === null) {
          findMeeting()
      } 
      // Otherwise, need to pull from backend to find meeting availability data
      else {
          loadValues()
      }
    }, []);

  const handleEventClick = (arg) => {
    const saved_events = {...savedEvents };
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
    setSavedEvents(saved_events);
  }

  const handleMouseEnter = (arg) => {
    arg.el.classList.add('event_hover'); // Add custom class on mouse enter
  }

  const handleMouseLeave = (arg) => {
    arg.el.classList.remove('event_hover'); // Add custom class on mouse enter
  }

  const handleStartChange = (event) => {
    setMinTime(event.target.value);
  }

  const handleEndChange = (event) => {
    setEndTime(event.target.value);
  }

  const findMeeting = async () => {
    const meetingID = searchParams.get("id");
    let url = `${process.env.REACT_APP_BACKEND}/meeting/getMeeting?id=${meetingID}`
    let metadata = { method: "GET" }
    try {
      const response = await fetch(url, metadata)
      const data = await response.json()
      console.log("Meeting findMeeting data:", data)
      if (data.meeting !== undefined) {
          if (userID && data.meeting.meetingMemberIDs && data.meeting.meetingMemberIDs.includes(userID)) { 
            console.log("userID")
          }
          else {
            console.log("Rendering JoinMeeting:", data.meeting)
            navigate(`/join-meeting?id=${meetingID}`,
                { state: { meetingID: meetingID, availability: data.meeting.intersections, meetingMemberIDs: data.meeting.meetingMemberIDs }
            })
          }
          setMeetingID(data.meeting.meetingID);
          setMeetingOrganizer(data.meeting.organizer);
          setIntersections(data.meeting.intersections);
          setMeetingMemberIDs(data.meeting.meetingMemberIDs);
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
        console.log("user id", start_end[2]);
        if (start_end[0] < timeNow) continue;
        const _event = {
          title: start_end[2],
          start: start_end[0],
          end: start_end[1],
          id: uuidv4(),
          saved: false,
        };
        _events.push(_event);
        setEventsArray(_events);
        setMeetingID(meetingID);
        setMeetingMemberIDs(meetingMemberIDs);
      }
    }
  }

  const checkSavedEvents = () => {
    console.log(savedEvents);
    for (let event_id in savedEvents) {
      //console.log("event id: ", event_id);
      console.log("event data: ", savedEvents[event_id]);
    }
  }

  const confirmMeeting = () => {
    if (!localStorage.getItem("meetingMemberIDs")) localStorage.setItem("meetingMemberIDs", JSON.stringify(meetingMemberIDs))
    if (!localStorage.getItem("savedEvents")) localStorage.setItem("savedEvents", JSON.stringify(savedEvents))
    handleAuthClick();
  }

  const setupCalendarEvent = async () => {
    await formatEvent(JSON.parse(localStorage.getItem("savedEvents")), JSON.parse(localStorage.getItem("meetingMemberIDs")))
    if (localStorage.getItem("savedEvents")) localStorage.removeItem("savedEvents")
    if (localStorage.getItem("meetingMemberIDs")) localStorage.removeItem("meetingMemberIDs")
  }
  
  return (
    <React.Fragment>
        <div>
          <Navbar handleAuthClick = {handleAuthClick}/>
        </div>

        <p>MEETING MEMBERS AVAILABILITY (meeting organizer can confirm meeting times when ready)</p>

        <button onClick={checkSavedEvents}>check saved events</button>

        <p>meeting organizer: {meetingOrganizer}</p>
        <p>meeting members: {meetingMemberIDs}</p>

        <div>
        <button onClick={confirmMeeting}>Confirm final meeting time</button>
        </div>
        
        <div>
        <input type="checkbox" />
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
            //eventColor={'#634a71'}
            
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
            editable={true} // allows both resizing and dragging
            eventDurationEditable={true}
            eventResizableFromStart={true}
            //eventDrop={handleEventDrop}
            //slotEventOverlap={true} // true => slight overlap ?
            slotEventOverlap={false} // false => side by side, no overlap
          />
        </calendar>
  
        </React.Fragment>
  )
}