import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // plugin
import googleCalendarPlugin from '@fullcalendar/google-calendar'
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import { handleClientLoad, handleAuthClick, config } from '../components/CalendarAPI';
import Navbar from "../components/Navbar"
import './style.css'

const Calendar = () => {
    const navigate = useNavigate()
    const didMount = useRef(false);
    const [calendarsData, setCalendarsData] = useState(null);
    const [events, setEvents] = useState([]);
    const [intersections, setIntersections] = useState([]);
    const [minTime, setMinTime] = useState('06:00:00');
    const [endTime, setEndTime] = useState('22:00:00');
    const [meetingID, setMeetingID] = useState(null);
    const [meetingMemberIDS, setMeetingMemberIDS] = useState(null);

    useEffect(() => {
        handleClientLoad(updateCalendars);
    }, [])

    useEffect(() => {
        if (intersections !== null && intersections.length > 0)
        navigate(`/meeting?id=${meetingID}`, {state: { meetingID : meetingID, intersections : intersections, meetingMemberIDS : meetingMemberIDS }})
    }, [intersections])

    const updateCalendars = async (calendars, tEvents) => {
        setCalendarsData(calendars)
        setEvents(tEvents)
        await new Promise(r => setTimeout(r, 500));
        showCalendars(tEvents)
    }

    const showCalendars = async (tEvents) => {
    await new Promise(r => setTimeout(r, 500));
    let eventsArray = tEvents.map(event => [!isNaN(Date.parse(event.start)) ? Date.parse(event.start) : 0, !isNaN(Date.parse(event.end)) ? Date.parse(event.end) : 0])
    console.log("calendarsData:", calendarsData)
    let body = {"_id" : "SECOND ID TEST", "events" : eventsArray}
    let url = process.env.REACT_APP_BACKEND
    let metadata = {
        method: "POST",
        body: JSON.stringify(body),
        headers: {'Content-Type': 'application/json'}
    }
    try {
        const response = await fetch(url, metadata)
        const data = await response.json()
        console.log("data:", data)
        if (data.meeting !== undefined) {
        console.log("finding meetingMemberIDs IN FCAL:", data.meeting.meeting)
        console.log("finding meetingMemberIDs IN FCAL:", Object.keys(data.meeting.meeting))
        setMeetingID(data.meeting.meetingID);
        setIntersections(data.meeting.meeting.intersections);
        setMeetingMemberIDS(data.meeting.meeting.meetingMemberIDS);
        console.log("Finished setting, will now render FMeeting")
        }
    } catch (error) {
        console.log(error);
    }
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

    const handleStartChange = (event) => {
        setMinTime(event.target.value)
    }

    const handleEndChange = (event) => {
        setEndTime(event.target.value)
    }

    if (meetingID !== null && intersections.length > 0 && meetingMemberIDS !== undefined) {
        console.log("Now rendering FMEETING")
        console.log(meetingID)
        console.log(intersections)
        console.log(meetingMemberIDS)
        navigate(`/meeting?id=${meetingID}`, {state: { meetingID : meetingID, intersections : intersections, meetingMemberIDS : meetingMemberIDS }})
    }
    else {
        console.log("meetingID:", meetingID)
        console.log("intersections:", intersections)

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
            events ={[]}
            //editable={true} // allows both resizing and dragging
            eventDurationEditable={true}
            eventResizableFromStart={true}
            />
        </calendar>

        </React.Fragment>
        )
    }

    }


export default Calendar