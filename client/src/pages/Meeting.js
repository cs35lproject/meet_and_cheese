import { useLocation, useSearchParams, useNavigate, createSearchParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // plugin
import googleCalendarPlugin from '@fullcalendar/google-calendar'
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { v4 as uuidv4 } from 'uuid';
import Button from '@mui/material/Button';
import tippy from 'tippy.js';

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
    const [minTime, setMinTime] = useState('00:00');
    const [endTime, setEndTime] = useState('23:59');
    const [savedEvents, setSavedEvents] = useState({});

  useEffect(() => {
    loadValues()
  }, [intersections])

  useEffect(() => {
    if (!userID && localStorage.getItem("userID")) setUserID(localStorage.getItem("userID"))
    handleClientLoad(setupCalendarEvent)
    // If users came from Calendar page, intersections Hook would have availability
    if (state && state.justCreated) {
      loadValues();
    }
    // Otherwise, need to pull from backend to find meeting availability data
    else {
        findMeeting()
    } 
  }, []);

  const handleSelect = (arg) => {
    if (!(meetingOrganizer === userID)) {
      console.log("not organizer");
      return;
    };

    let temp_events = [];
    let temp_saved =[];
    for (let e of eventsArray) {
      if (e.title === "Meeting") continue;
      temp_events.push({...e});
    };

    let temp_e = {
      title: "Meeting",
      start: arg.start,
      end: arg.end, 
    }
    temp_events.push(temp_e);

    temp_saved.push([temp_e.start, temp_e.end]);

    setSavedEvents(temp_saved);
    setEventsArray(temp_events);
  }

  const handleEventMount = (info) => {
    // const tipContent = `<strong>${info.event.title} is available </strong>`
    let names = [];
    //let msg = `${info.event.title} available`;
    let msg = "";

    // check which events overlapping
    for (const e of eventsArray) {
      if (info.event.start >= e.start && info.event.end <= e.end ||
        info.event.start >= e.start && info.event.start <= e.end ||
        info.event.start <= e.start && info.event.end >= e.end) {
          names.push(e.title);
        };
    };

    for (const n of [...new Set(names)]) {
      msg += n + " available\n";
    };

    if (info.event.title === "Meeting") {
      msg = "Meeting";
      return;
    };

    tippy(info.el, {
      content: msg,
      placement: 'left',
      trigger: 'mouseenter',
      hideOnLeave: true,
      hideOnClick: true,
      animation: 'scale',
      duration: 0,
      multiple: true,
    });
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
      console.log(data)
      if (data.meeting !== undefined) {
        setMeetingID(data.meeting.meetingID);
        setMeetingOrganizer(data.meeting.organizer);
        setIntersections(data.meeting.intersections);
        setMeetingMemberIDs(data.meeting.meetingMemberIDs);
        if (userID && data.meeting.meetingMemberIDs && data.meeting.meetingMemberIDs.includes(userID)) {
        }
        else {
          navigate(`/join-meeting?id=${meetingID}`,
            {
              state: { meetingID: meetingID, availability: data.meeting.intersections, meetingMemberIDs: data.meeting.meetingMemberIDs }
            })
        }
      }
    } catch (e) {
      console.log(e);
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
          title: start_end[2],
          start: start_end[0],
          end: start_end[1],
          id: uuidv4(),
          saved: false,
          display: 'background',
        };
        _events.push(_event);
        setEventsArray(_events);
        setMeetingID(meetingID);
        setMeetingMemberIDs(meetingMemberIDs);
      }
    }
  }

  const confirmMeeting = () => {
    let inputs = document.getElementsByClassName("invite-input");
    let values = []
    for (let element of inputs) {
      values.push(element.value)
    }
    
    if (!localStorage.getItem("values"))
      localStorage.setItem("values", JSON.stringify(values))
    if (!localStorage.getItem("meetingMemberIDs"))
      localStorage.setItem("meetingMemberIDs", JSON.stringify(meetingMemberIDs))
    if (!localStorage.getItem("savedEvents")) 
      localStorage.setItem("savedEvents", JSON.stringify(savedEvents))
    handleAuthClick();
  }

  const setupCalendarEvent = async () => {
    await formatEvent(JSON.parse(localStorage.getItem("savedEvents")), JSON.parse(localStorage.getItem("meetingMemberIDs")), JSON.parse(localStorage.getItem("values")))

    if (localStorage.getItem("savedEvents")) localStorage.removeItem("savedEvents")
    if (localStorage.getItem("meetingMemberIDs")) localStorage.removeItem("meetingMemberIDs")
    if (localStorage.getItem("values")) localStorage.removeItem("values")
    navigate(`/`,
      { state: {  }
    })
  }


  const loadMeetingMembers = () => {
    let membersElements = ""
    let uniqueMembers = []
    let displayMembers = []
    for (let member in meetingMemberIDs) {
      if (meetingMemberIDs[member] !== meetingOrganizer) {      
        if (member == meetingMemberIDs.length - 1)
          membersElements += (`${meetingMemberIDs[member]}`)
        else
          membersElements += (`${meetingMemberIDs[member]},`)
        
        if (!uniqueMembers.includes(meetingMemberIDs[member])) {
          displayMembers.push(<div><li>{meetingMemberIDs[member]}</li></div>)
          uniqueMembers.push(meetingMemberIDs[member]);
        }
      }
    }
    return displayMembers;
  }

  const loadConfirmMeeting = () => {
    if (userID === meetingOrganizer && savedEvents && savedEvents.length > 0) {
      return (
        <div>
          <div id="invite-wrapper">
            <div className="invite-text">
              <h4 className="meet-h4">Title:</h4>
              <input className="invite-input"></input>
            </div>
            <div className="invite-text">
              <h4 className="meet-h4">Desc:</h4>
              <input className="invite-input"></input>
            </div>
          </div>
          <div className="meeting-confirm">
          <Button onClick={confirmMeeting} variant="contained" style={{ backgroundColor: "#4D368C", color: "white", 
          display: "flex", justifyContent: "center", margin: "0 auto", marginTop: "10px"
          }}>confirm meeting</Button>
          </div>
        </div>
      )
    }
  }
  
  return (
    <React.Fragment>
      <div>
        <Navbar handleAuthClick={handleAuthClick} />
      </div>

      <div className="flex-container">
        <div className="left-column">
          <div className="left-column-contents">

          {/*<div className='meeting-buttons' > */}
            <div 
              className = {`meeting-buttons ${(userID === meetingOrganizer 
                && savedEvents && savedEvents.length > 0) ? "expanded" : ""}`}
            >
            <h4>Your Meeting.</h4>
                Time to finalize your meeting.
              <h4 className="meet-h4">Organizer: </h4>
              {meetingOrganizer}
              <h4 className="meet-h4">Members: </h4>
              <div className="meeting-members-box">
                <ul className="meeting-members-list">
                  {loadMeetingMembers()}
                </ul>
              </div>
              <div className="times">
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
             <div className="meeting-button-spacing">
                <div button>
                    {loadConfirmMeeting()}
                  </div>
              </div>

          </div>
            
          </div>
        </div>

        <div class="right-column">
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
            slotMinTime={minTime}
            slotMaxTime={endTime}
            events ={eventsArray}
            eventDidMount = {handleEventMount}
            selectable = {userID === meetingOrganizer}
            select = {handleSelect}
            selectOverlap = {true}
            eventTimeFormat= {{
              hour: "2-digit",
              minute: "2-digit",
              hour12: true
            }}
            slotEventOverlap={true} // false => side by side, no overlap; true => overlap/transparency
          />
          
        </calendar>
        </div>
      </div>

    </React.Fragment>
  )
} 