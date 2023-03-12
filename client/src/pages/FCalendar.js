import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, createSearchParams } from 'react-router-dom'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // plugin
import googleCalendarPlugin from '@fullcalendar/google-calendar'
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import { handleClientLoad, handleAuthClick, config } from '../components/CalendarAPI';
import Navbar from "../components/Navbar"
import './style.css'

const FCalendar = () => {
    const navigate = useNavigate()
    const [calendarsData, setCalendarsData] = useState(null); // Contains all formatted calendar data. May be useful in future
    const [eventsData, setEventsData] = useState(null);
    const [intersections, setIntersections] = useState([]);
    const [meetingID, setMeetingID] = useState(null);
    const [meetingMemberIDS, setMeetingMemberIDS] = useState(null);

    useEffect(() => {
        handleClientLoad(updateCalendars);
    }, [])

    useEffect(() => {
        if (eventsData !== null && calendarsData !== null && eventsData.length > 0) {
            getIntersections(eventsData)
        }
    }, [eventsData, calendarsData])

    useEffect(() => {
        if (intersections !== null && intersections.length > 0 && meetingID !== null) {
            navigate({
                pathname: "meeting",
                search: createSearchParams({
                    id: meetingID
                }).toString()},{
                state: { meetingID: meetingID, intersections: intersections, meetingMemberIDS: meetingMemberIDS }
            })
        }
    }, [intersections])

    const updateCalendars = async (calendars, events) => {
        await new Promise(r => setTimeout(r, 500));
        setCalendarsData(calendars)
        setEventsData(events)
    }

    const getIntersections = async (events) => {
        let eventsArray = events.map(event => [!isNaN(Date.parse(event.start)) ? Date.parse(event.start) : 0, !isNaN(Date.parse(event.end)) ? Date.parse(event.end) : 0])
        let body = {"_id" : "SECOND ID TEST", "events" : eventsArray}
        let url = process.env.REACT_APP_CREATE_MEETING
        let metadata = {
            method: "POST",
            body: JSON.stringify(body),
            headers: {'Content-Type': 'application/json'}
        }
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
          />
        </calendar>

        </React.Fragment>
        )
    }

export default FCalendar
