import { useNavigate, useLocation, createSearchParams } from 'react-router-dom'
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
import "./Calendar.css"
import './style.css';

export default function Calendar() {
    const { state } = useLocation();
    const navigate = useNavigate()
    const [calendarsData, setCalendarsData] = useState(null);
    const [userID, setUserID] = useState(null);
    const [eventsData, setEventsData] = useState(null);
    const [displayedAvailability, setDisplayedAvailability] = useState([]);
    const [savedAvailability, setSavedAvailability] = useState([]);
    const [confirmedAvailability, setConfirmedAvailability] = useState({});
    const [meetingID, setMeetingID] = useState(null);
    const [meetingMemberIDs, setMeetingMemberIDs] = useState(null);

    const [ogAvail, setOgAvail] = useState([]); // can maybe change back to an array & push events

    const [minTime, setMinTime] = useState('00:00');
    const [endTime, setEndTime] = useState('23:59');

    // When user loads home screen, initialize Google Calendar API
    useEffect(() => {
        if (state && state.doAuthClick) {
            handleClientLoad(updateCalendars, handleAuthClick);
        }
        else {
            handleClientLoad(updateCalendars);
        }
    }, [])

    // When meetingID hook is updated from specified meetingID by backend, save new user to backend and route to meeting page
    useEffect(() => {
        if (meetingID !== null) {
            createUser();
            navigate({
                pathname: "meeting",
                search: createSearchParams({ id: meetingID }).toString()
            },
                {
                    state: { meetingID: meetingID, availability: confirmedAvailability, meetingMemberIDs: meetingMemberIDs, organizer: userID }
                })
        }
    }, [meetingID])

    // Find availabilities when Google Calendar API data updates hooks
    useEffect(() => {
        if (eventsData !== null && calendarsData !== null && eventsData.length > 0) {
            let eventsArray = eventsData.map(event => [!isNaN(Date.parse(event.start)) ? Date.parse(event.start) : 0, !isNaN(Date.parse(event.end)) ? Date.parse(event.end) : 0])
            let intersection = intersectionFind(eventsArray, [[0, Infinity]])
            if (intersection.length === 0) {
                let today = new Date();
                let tmrw = new Date(today);
                tmrw.setDate(tmrw.getDate() + 1)
                intersection = [[today.getTime(), tmrw.getTime()]]
            }
            loadValues(intersection)
        }
    }, [eventsData, calendarsData])

    // Update hooks with Google Calendar API data
    const updateCalendars = async (calendars, events, primaryEmail) => {
        await new Promise(r => setTimeout(r, 400));
        setCalendarsData(calendars)
        setUserID(primaryEmail)
        setEventsData(events)
        if (!localStorage.getItem("userID")) {
            localStorage.setItem("userID", primaryEmail)
        }
    }

    // Save new user with userID & meetingID to backend
    const createUser = async () => {
        let body = { "userID": userID, "meetingID": meetingID, "isCreated": true }
        let url = `${process.env.REACT_APP_BACKEND}/user/createUser`
        let metadata = {
            method: "POST", body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }
        }
        try {
            const response = await fetch(url, metadata)
            const data = await response.json()
        } catch (e) {
            console.log(e);
        }
    }

    // Save new meeting (with userID and availability) from confirmed availabilities to backend
    const confirmAvailability = async () => {
        let confirmed_availability = []
        for (let event_id in savedAvailability) {
            confirmed_availability.push([!isNaN(Date.parse(savedAvailability[event_id][0])) ? Date.parse(savedAvailability[event_id][0]) : 0, !isNaN(Date.parse(savedAvailability[event_id][1])) ? Date.parse(savedAvailability[event_id][1]) : 0, userID])
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
            console.log(data)
            setMeetingID(data.meeting.meetingID)
            setMeetingMemberIDs(data.meeting.meetingMemberIDs)
        } catch (e) {
            console.log(e);
        }
    }

    // Transform availability from Google Calendar API into displayed availabilities on calendar GUI
    const loadValues = async (tempAvailability) => {
        await new Promise(r => setTimeout(r, 100));
        if (tempAvailability) {
            let _events = [];
            let _ogevents = [];
            const timeNow = Date.now();
            for (const start_end of tempAvailability) {
                // testing: will show all availability before too
                // if (start_end[1] < timeNow) continue; // this gets every availability before current day
                if (start_end[0] < timeNow) continue; // this is not accurate, does not get some availability

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
                                backgroundColor: "green"
                            };
                            _events.push(_event);
                            _ogevents.push({ ..._event });
                            s = new Date(s.getFullYear(), s.getMonth(), s.getDate() + 1, 0, 0, 0)
                        }
                        else { // e >= end
                            const _event = {
                                title: "Available",
                                start: s,
                                end: start_end[1],
                                id: uuidv4(),
                                saved: false,
                                backgroundColor: "green"
                            };
                            _events.push(_event);
                            _ogevents.push({ ..._event });
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
                        backgroundColor: "green"
                    };
                    _events.push(_event);
                    _ogevents.push({ ..._event });
                };
            }
            setDisplayedAvailability(_events);
            setOgAvail(_ogevents);
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

        let temp_displayed = [];
        for (let e of displayedAvailability) {
            temp_displayed.push({ ...e });
        }

        const idx = temp_displayed.findIndex(event => event.id === arg.event.id);

        if (arg.event.extendedProps.saved) {
            arg.event.setExtendedProp("saved", false);
            arg.event.setProp("backgroundColor", "green");
            delete saved_events[arg.event.id];
            temp_displayed[idx].saved = false;
            temp_displayed[idx].backgroundColor = "green";
        }
        else {
            arg.event.setExtendedProp("saved", true);
            arg.event.setProp("backgroundColor", "red");
            saved_events[arg.event.id] = [arg.event.start, arg.event.end];
            temp_displayed[idx].saved = true;
            temp_displayed[idx].backgroundColor = "red";
        }
        setSavedAvailability(saved_events);
        setDisplayedAvailability(temp_displayed);
    }

    const handleEventDrop = (arg) => {
        const saved_events = { ...savedAvailability };
        let temp_displayed = [];

        for (let e of displayedAvailability) {
            temp_displayed.push({ ...e });
        }

        const idx = temp_displayed.findIndex(event => event.id === arg.event.id);

        if (arg.oldEvent.extendedProps.saved) {
            // replace the old event with the new, by key = id
            delete saved_events[arg.oldEvent.id]
            saved_events[arg.event.id] = [arg.event.start, arg.event.end]
        }
        temp_displayed[idx].start = arg.event.start;
        temp_displayed[idx].end = arg.event.end;

        setSavedAvailability(saved_events);
        setDisplayedAvailability(temp_displayed);
    }

    const handleEventResize = (arg) => {
        const saved_events = { ...savedAvailability };
        let temp_displayed = [];

        for (let e of displayedAvailability) {
            temp_displayed.push({ ...e });
        }

        const idx = temp_displayed.findIndex(event => event.id === arg.event.id);
        // if the event was saved pre-drop
        if (arg.oldEvent.extendedProps.saved) {
            // replace the old event with the new, by key = id
            delete saved_events[arg.oldEvent.id]
            saved_events[arg.event.id] = [arg.event.start, arg.event.end]
        }
        temp_displayed[idx].start = arg.event.start;
        temp_displayed[idx].end = arg.event.end;

        setSavedAvailability(saved_events);
        setDisplayedAvailability(temp_displayed);
    }

    const handleMouseEnter = (arg) => {
        arg.el.classList.add('event_hover'); // Add custom class on mouse enter
    }

    const handleMouseLeave = (arg) => {
        arg.el.classList.remove('event_hover'); // Add custom class on mouse enter
    }

    const handleStartChange = (event) => {
        setMinTime(event.target.value);

        let displayed_temp = [];
        let saved_temp = { ...savedAvailability };

        const [start_hr, start_min] = (event.target.value).split(":");

        for (const e of displayedAvailability) {
            const new_start = new Date(e.start);
            new_start.setHours(start_hr);
            new_start.setMinutes(start_min);
            if (e.start < new_start) { // e.start is before start constraint
                if (e.end <= new_start) { //e.end is before or at start constraint; don't display
                    delete saved_temp[e.id];
                    continue;
                }
                const new_e = {
                    title: "Available",
                    start: new_start,
                    end: e.end,
                    id: e.id,
                    saved: e.saved,
                    backgroundColor: e.backgroundColor
                };
                if (e.saved) {
                    delete saved_temp[e.id];
                    saved_temp[e.id] = [new_start, e.end];
                };
                displayed_temp.push(new_e);
            }
            else { // e.start is after or at the start constraint; no changes needed
                displayed_temp.push(e);
            }
        }
        setDisplayedAvailability(displayed_temp);
        setSavedAvailability(saved_temp);
    }

    const handleEndChange = (event) => {
        setEndTime(event.target.value);

        let displayed_temp = [];
        let saved_temp = { ...savedAvailability };

        const [end_hr, end_min] = (event.target.value).split(":");

        for (const e of displayedAvailability) {
            const new_end = new Date(e.end);
            new_end.setHours(end_hr);
            new_end.setMinutes(end_min);

            if (e.end > new_end) { // e.end after end constraint
                if (e.start >= new_end) { // e.start after or at end constraint; don't display
                    delete saved_temp[e.id];
                    continue;
                }
                const new_e = {
                    title: "Available",
                    start: e.start,
                    end: new_end,
                    id: e.id,
                    saved: e.saved,
                    backgroundColor: e.backgroundColor
                };
                if (e.saved) {
                    delete saved_temp[e.id];
                    saved_temp[e.id] = [new_e.start, new_e.end];
                }
                displayed_temp.push(new_e);
            }
            else { // e.end before or at the end constraint; no changes needed
                displayed_temp.push(e);
            }
        }
        setDisplayedAvailability(displayed_temp);
        setSavedAvailability(saved_temp);
    }

    const revertChanges = () => {
        let temp_avail = [];

        //setDisplayedAvailability([...ogAvail]);
        for (let e of ogAvail) {
            temp_avail.push({ ...e });
        }

        setDisplayedAvailability(temp_avail);
        setSavedAvailability([]);

        setMinTime('00:00');
        setEndTime('23:59');
    }

    const confirmButton = () => {
        if (eventsData) {
            
            return <Button variant="contained" onClick={confirmAvailability} 
                style={{ backgroundColor: "#4D368C", color: "white", display: "flex", justifyContent: "center", margin: "0 auto"
                }}>Confirm Availability</Button>
            
        }
    }

    const revertChangesButton = () => {
        return <Button variant="contained" onClick={revertChanges} 
                style={{ backgroundColor: "#4D368C", color: "white", display: "flex", justifyContent: "center", margin: "0 auto"
                }}>Revert Changes</Button>
    }

    const loadTitle = () => {
        // Title when user hasn't signed in yet
        if (!eventsData)
            return (
                <div className="all-members2">
                    <p> Click create meeting to start!</p>
                </div>
            )
    }

    const loadDesc = () => {
        // Description when user signed in & loaded calendar events
        if (eventsData)
            return (
                <div className="all-members">
                    <p className="page-desc">Click on the highlighted time slots that accurately reflect your availability for meeting times</p>
                    <p className="page-desc">Drag the top/bottom of highlighted time slots to modify their times</p>
                </div>
            )
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
                            <div className='all-buttons'>
                            <h4>Create a meeting.</h4>
                                Click to choose your availability.
                                Drag, drop, and resize your availability to fit your schedule.
                                <br/>
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
                                <div className="button-spacing">
                                    {confirmButton()}
                                </div>
                                <div className="button-spacing">
                                    {revertChangesButton()}
                                </div>
                            </div>
                        </>
                    ) : (
                        <h4>Please sign in to create a meeting</h4>
                    )}
                    {!eventsData && 
                        <div>
                            <br/>
                            <Button variant="contained" onClick={handleAuthClick} 
                            style={{ backgroundColor: "#4D368C", color: "white", display: "flex", justifyContent: "center", margin: "0 auto"
                            }}>Sign in</Button>
                            <br/>
                        </div>
                    }
                </div>
            </div>

                <div className="right-column">
                    <calendar id="calendar-element">
                        <div className="square"></div>
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
                            eventOverlap={false}
                            //eventAfterRender={handleEventAfterRender}
                            eventTimeFormat={{
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true
                            }}
                        />
                    </calendar>
                </div>
            </div>

        </React.Fragment>
    )
}
