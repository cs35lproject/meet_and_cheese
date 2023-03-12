import { useNavigate, createSearchParams } from 'react-router-dom'
import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // plugin
import googleCalendarPlugin from '@fullcalendar/google-calendar'
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { v4 as uuidv4 } from 'uuid';

import { handleClientLoad, handleAuthClick, config } from '../components/CalendarAPI';
import intersectionFind from '../components/intersectionFind';
import Navbar from "../components/Navbar";
import './style.css';

export default function Calendar() {
    const navigate = useNavigate()
    const [calendarsData, setCalendarsData] = useState(null);
    const [userID, setUserID] = useState(null);
    const [eventsData, setEventsData] = useState(null);
    const [displayedAvailability, setDisplayedAvailability] = useState([]);
    const [savedAvailability, setSavedAvailability] = useState([]);
    const [confirmedAvailability, setConfirmedAvailability] = useState({});
    const [meetingID, setMeetingID] = useState(null);
    const [meetingMemberIDs, setMeetingMemberIDs] = useState(null);
    
    const [minTime, setMinTime] = useState('06:00:00');
    const [endTime, setEndTime] = useState('22:00:00');

    useEffect(() => {
        handleClientLoad(updateCalendars);
    }, [])

    useEffect(() => {
        if (meetingID !== null) {
            console.log("confirmed availability in useEffect:", confirmedAvailability)
            navigate({
                pathname: "meeting",
                search: createSearchParams({ id: meetingID }).toString()}, 
                { state: { meetingID: meetingID, availability: confirmedAvailability, meetingMemberIDs: meetingMemberIDs }
            })
        }
    }, [meetingID])

    useEffect(() => {
        if (eventsData !== null && calendarsData !== null && eventsData.length > 0) {
            let eventsArray = eventsData.map(event => [!isNaN(Date.parse(event.start)) ? Date.parse(event.start) : 0, !isNaN(Date.parse(event.end)) ? Date.parse(event.end) : 0])
            let intersection = intersectionFind(eventsArray, [[0, Infinity]])
            console.log("intersection:", intersection)
            loadValues(intersection)
        }
    }, [eventsData, calendarsData])

    const updateCalendars = async (calendars, events, primaryEmail) => {
        await new Promise(r => setTimeout(r, 400));
        setCalendarsData(calendars)
        setUserID(primaryEmail)
        setEventsData(events)
    }

    const confirmAvailability = async () => {
        console.log("saved_events:", savedAvailability)
        let confirmed_availability = []
        for (let event_id in savedAvailability) {
            confirmed_availability.push([!isNaN(Date.parse(savedAvailability[event_id][0])) ? Date.parse(savedAvailability[event_id][0]) : 0, !isNaN(Date.parse(savedAvailability[event_id][1])) ? Date.parse(savedAvailability[event_id][1]) : 0])
        }
        setConfirmedAvailability(confirmed_availability);
        let body = {"userID" : userID, "availability" : confirmed_availability}
        let url = process.env.REACT_APP_CREATE_MEETING
        let metadata = { method: "POST", body: JSON.stringify(body), headers: {'Content-Type': 'application/json'}
        }
        try {
            const response = await fetch(url, metadata)
            const data = await response.json()
            setMeetingID(data.meeting.meetingID)
            setMeetingMemberIDs(data.meeting.meetingMemberIDs)
        } catch (error) {
            console.log(error);
        }
    }

    const loadValues = async (tempAvailability) => {
        await new Promise(r => setTimeout(r, 100));
        if (tempAvailability) {
            let _events = [];
            const timeNow = Date.now();
            for (const start_end of tempAvailability) {
            if (start_end[0] < timeNow) continue;
            const _event = {
              title: "Available",
              start: start_end[0],
              end: start_end[1],
              id: uuidv4(),
              saved: false,
            };
            _events.push(_event);
            setDisplayedAvailability(_events);
            }
        }
    }

    const handleEventClick = (arg) => {
    const saved_events = {...savedAvailability };
    if (arg.event.extendedProps.saved) {
        arg.event.setExtendedProp("saved", false);
        arg.event.setProp("backgroundColor", "green");
        delete saved_events[arg.event.id];
    }
    else {
        arg.event.setExtendedProp("saved", true);
        arg.event.setProp("backgroundColor", "red");
        saved_events[arg.event.id] = [arg.event.start, arg.event.end];
    }
    setSavedAvailability(saved_events);
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

    const checkConfirmedAvailability = () => {
        console.log(savedAvailability);
        for (let event_id in savedAvailability) {
            console.log("event data: ", savedAvailability[event_id]);
        }
    }

    return (
        <React.Fragment>
            <div>
                <Navbar handleAuthClick = {handleAuthClick}/>
            </div>

            <p>{eventsData ? "CREATE MEETING (expand, shrink, drag to modify availability. select times which accurately reflect your availability, then confirm times)" : "LOG IN TO START"}</p>

            <button onClick={confirmAvailability}>Confirm availability</button>

            <button onClick={checkConfirmedAvailability}>check confirmed availability</button>

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
                events ={displayedAvailability}
                editable={true} // allows both resizing and dragging
                eventDurationEditable={true}
                eventResizableFromStart={true}
                //eventDrop={handleEventDrop}
                />
            </calendar>
        
            </React.Fragment>
      )
    }