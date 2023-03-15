import { useNavigate, createSearchParams } from 'react-router-dom'
import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // plugin
import googleCalendarPlugin from '@fullcalendar/google-calendar'
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { v4 as uuidv4 } from 'uuid';
import Button from '@mui/material/Button';

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

    // When user loads home screen, initialize Google Calendar API
    useEffect(() => {
        console.log("calendar a")
        handleClientLoad(updateCalendars);
    }, [])

    // When meetingID hook is updated from specified meetingID by backend, save new user to backend and route to meeting page
    useEffect(() => {
        console.log("calendar b")
        if (meetingID !== null) {
            console.log("confirmed availability in useEffect:", confirmedAvailability)
            createUser();
            navigate({
                pathname: "meeting",
                search: createSearchParams({ id: meetingID }).toString()
            },
                {
                    state: { meetingID: meetingID, availability: confirmedAvailability, meetingMemberIDs: meetingMemberIDs }
                })
        }
    }, [meetingID])

    // Find availabilities when Google Calendar API data updates hooks
    useEffect(() => {
        console.log("calendar c")
        if (eventsData !== null && calendarsData !== null && eventsData.length > 0) {
            let eventsArray = eventsData.map(event => [!isNaN(Date.parse(event.start)) ? Date.parse(event.start) : 0, !isNaN(Date.parse(event.end)) ? Date.parse(event.end) : 0])
            let intersection = intersectionFind(eventsArray, [[0, Infinity]])
            console.log("intersection:", intersection)
            loadValues(intersection)
        }
    }, [eventsData, calendarsData])

    // Update hooks with Google Calendar API data
    const updateCalendars = async (calendars, events, primaryEmail) => {
        await new Promise(r => setTimeout(r, 400));
        console.log("Called updateCalendars")
        setCalendarsData(calendars)
        setUserID(primaryEmail)
        setEventsData(events)
        if (!localStorage.getItem("userID")) {
            localStorage.setItem("userID", primaryEmail)
        }
    }

    // Save new user with userID & meetingID to backend
    const createUser = async () => {
        let body = { "userID": userID, "meetingID": meetingID }
        let url = `${process.env.REACT_APP_BACKEND}/user/createUser`
        let metadata = {
            method: "POST", body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }
        }
        try {
            const response = await fetch(url, metadata)
            const data = await response.json()
        } catch (error) {
            console.log(error);
        }
    }

    // Save new meeting (with userID and availability) from confirmed availabilities to backend
    const confirmAvailability = async () => {
        console.log("saved_events:", savedAvailability)
        let confirmed_availability = []
        for (let event_id in savedAvailability) {
            confirmed_availability.push([!isNaN(Date.parse(savedAvailability[event_id][0])) ? Date.parse(savedAvailability[event_id][0]) : 0, !isNaN(Date.parse(savedAvailability[event_id][1])) ? Date.parse(savedAvailability[event_id][1]) : 0])
        }
        setConfirmedAvailability(confirmed_availability);
        let body = { "userID": userID, "availability": confirmed_availability }
        let url = `${process.env.REACT_APP_BACKEND}/meeting/createMeeting`
        let metadata = {
            method: "POST", body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }
        }
        try {
            const response = await fetch(url, metadata)
            const data = await response.json()
            console.log("data:", data)
            setMeetingID(data.meeting.meetingID)
            setMeetingMemberIDs(data.meeting.meetingMemberIDs)
        } catch (error) {
            console.log(error);
        }
    }

    // Transform availability from Google Calendar API into displayed availabilities on calendar GUI
    const loadValues = async (tempAvailability) => {
        await new Promise(r => setTimeout(r, 100));
        if (tempAvailability) {
            let _events = [];
            const timeNow = Date.now();
            for (const start_end of tempAvailability) {
                // testing: will show all availability before too
                if (start_end[1] < timeNow) continue;

                // if event spans multiple days
                if (!isOneDay(start_end)) {
                    let s = new Date(start_end[0]); // temp start
                    const end = new Date(start_end[1]); // end

                    // iterate until reach end
                    while (s < end) {

                        const e = new Date(s); // temp end
                        e.setHours(23);
                        e.setMinutes(59);
                        e.setSeconds(59);

                        if (e < end) {
                            const _event = {
                                title: "Available",
                                start: s,
                                end: e,
                                id: uuidv4(),
                                saved: false,
                            };
                            _events.push(_event);
                            setDisplayedAvailability(_events);
                            s = new Date(s.getFullYear(), s.getMonth(), s.getDate() + 1, 0, 0, 0)
                        }
                        else {
                            const _event = {
                                title: "Available",
                                start: s,
                                end: start_end[1],
                                id: uuidv4(),
                                saved: false,
                            };
                            _events.push(_event);
                            setDisplayedAvailability(_events);
                            break;
                        }
                    }
                }

                else {
                    const _event = {
                        title: "Available",
                        start: start_end[0],
                        end: start_end[1],
                        id: uuidv4(),
                        saved: false,
                    };
                    _events.push(_event);
                    setDisplayedAvailability(_events);
                };
            }
        }
    }

    // Check to see if event only spans one day (ex. monday - monday)
    // cannot be Mon 5 pm - Tue 1 am
    const isOneDay = ([s, e]) => {
        const start = new Date(s);
        const end = new Date(e);
        if (start.getDate() === end.getDate()
            && start.getMonth() === end.getMonth()
            && start.getFullYear() === end.getFullYear()) {
            return true;
        }
        else return false;
    }

    // Save displayed events to savedAvailability hook when user clicks on event from calendar GUI
    const handleEventClick = (arg) => {
        const saved_events = { ...savedAvailability };
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

    const handleEventDrop = (arg) => {
        const saved_events = { ...savedAvailability };

        // if the event was saved pre-drop
        if (arg.oldEvent.extendedProps.saved) {
            if (arg.oldEvent.id === arg.event.id) console.log("same id! was expected");
            // replace the old event with the new, by key = id
            delete saved_events[arg.oldEvent.id]
            saved_events[arg.event.id] = [arg.event.start, arg.event.end]
        }
        setSavedAvailability(saved_events);
    }

    const handleEventResize = (arg) => {
        const saved_events = { ...savedAvailability };

        // if the event was saved pre-drop
        if (arg.oldEvent.extendedProps.saved) {
            if (arg.oldEvent.id === arg.event.id) console.log("same id! was expected");
            // replace the old event with the new, by key = id
            delete saved_events[arg.oldEvent.id]
            saved_events[arg.event.id] = [arg.event.start, arg.event.end]
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
        //console.log(savedAvailability);
        for (let event_id in savedAvailability) {
            console.log("event data: ", savedAvailability[event_id]);
        }
    }

    return (
        <React.Fragment>
            <div>
                <Navbar handleAuthClick={handleAuthClick} userID={userID} callback={updateCalendars} status={eventsData} />
            </div>
            <div className="flex-container">
                <div className="left-column">
                    <div className="left-column-contents">
                        {eventsData ? (
                            <>
                                <h4>Create Meeting</h4>
                                <p>Click and drag the time slots to select your availability.</p>
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
                                <div button>
                                    <Button
                                        variant="contained"
                                        onClick={confirmAvailability}
                                        style={{ backgroundColor: "#4D368C", color: "white", display: "flex", justifyContent: "center", margin: "0 auto" }}
                                    >
                                        Confirm Availability
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <h4>Please sign in to create a meeting</h4>
                        )}

                            <div button>
                            <Button
                            variant="contained"
                            onClick={handleAuthClick}
                            style={{
                                background: "linear-gradient(to bottom, #43b7ff, #cdecff)",
                                color: "#4D368C",
                                fontFamily: "'Nobile', Helvetica, Arial, sans-serif",
                                fontWeight: 600,
                                display: "flex",
                                justifyContent: "center",
                                margin: "0 auto",
                                marginTop: "20px",
                                boxShadow: "none",
                                // borderRadius: "50%",
                                width: "100px",
                                height: "35px",
                                textTransform: "none",
                                transition: "background-color 0.2s ease-in-out",
                            }}
                            >
                            Sign In
                        </Button>
                        </div>
                    </div>
                </div>

                <div class="right-column">
                    <calendar>
                        <div class="square"></div>
                        <FullCalendar
                            plugins={[dayGridPlugin, googleCalendarPlugin, timeGridPlugin, interactionPlugin]}
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
                            events={displayedAvailability}
                            editable={true} // allows both resizing and dragging
                            eventDurationEditable={true}
                            eventResizableFromStart={true}
                            eventDrop={handleEventDrop}
                            eventResize={handleEventResize}
                        />
                    </calendar>
                </div>
            </div>

        </React.Fragment>
    )
}
