import React, { useState, useEffect } from 'react';
import ApiCalendar from 'react-google-calendar-api';

const config = {
  "clientId": process.env.REACT_APP_CLIENT_ID,
  "apiKey": process.env.REACT_APP_API_KEY,
  "scope": "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar",
  "discoveryDocs": [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
  ]
};

const CalendarAPI = (props) => {
  const [fullCalendars, setFullCalendars] = useState(null);
  const gapi = window.gapi;
  var apiCalendar;

  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.defer = true;
    script.src = "https://apis.google.com/js/api.js";

    document.body.appendChild(script);
    apiCalendar = new ApiCalendar(config);
    }, []
  );

  const authCal = () => {
    apiCalendar.handleAuthClick();
  }

  const setCalendars = () => {
    let tempCalendars = [];
    let curCalendar;
    apiCalendar.listCalendars().then( ({ result }) => {
      result.items.forEach((calendar) => {
        curCalendar = {};
        // Set calendar summary
        curCalendar.name = calendar.summaryOverride ? calendar.summaryOverride : calendar.summary;
        // Set calendar ID
        curCalendar.id = calendar.id

        // Set events for calendar
        setEvents(curCalendar);

        console.log(curCalendar.name, curCalendar)

        // Save to list of calendars
        tempCalendars.push(curCalendar);
      })
      setFullCalendars(tempCalendars);
    });
    return tempCalendars;
  }

  const setEvents = (calendar) => {
    let daysAhead = props.daysAhead ? props.daysAhead : 10;
    let maxResults = props.maxResults ? props.maxResults : 30;

    let minDate = new Date();
    let maxDate = new Date();

    minDate.setDate(minDate.getDate());
    maxDate.setDate(maxDate.getDate() + daysAhead);

    gapi.client.calendar.events
      .list({
        calendarId: calendar.id,
        timeMin: minDate.toISOString(),
        timeMax: maxDate.toISOString(),
        showDeleted: true,
        singleEvents: true,
        maxResults: maxResults,
        orderBy: "startTime",
      })
      .then( (response) => {
        calendar.events = response.result.items;
      });
  };

  return (
      <React.Fragment>
          <a href="/">Home</a>

          <button onClick={authCal}>Authenticate Calendar</button>

          <button onClick={setCalendars}>Get Calendar Information</button>

          <br />

      </React.Fragment>
  );
}

export default CalendarAPI