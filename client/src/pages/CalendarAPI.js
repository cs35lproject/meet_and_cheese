import React, { useState, useEffect } from 'react';
import ApiCalendar from 'react-google-calendar-api';

/*
Helpful links:

https://www.youtube.com/watch?v=zaRUq1siZZo&t=320s&ab_channel=Entrepreneerit

https://developers.google.com/calendar/api/v3/reference/events/list

https://github.com/google/google-api-javascript-client/blob/master/docs/reference.md#----gapiclientrequestargs--

https://github.com/Nouran96/full-calendar-google-calendar/blob/main/src/components/GoogleCalendar.js

https://github.com/Kubessandra/react-google-calendar-api/blob/master/exemple-app/src/components/TestDemo.jsx

*/
const config = {
  "clientId": process.env.REACT_APP_CLIENT_ID,
  "apiKey": process.env.REACT_APP_API_KEY,
  "scope": "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar",
  "discoveryDocs": [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
  ]
}

const CalendarAPI = () => {

  const [events, setEvents] = useState(null);

  const [calendarNames, setCalendarNames] = useState(null);
  const [calendarIDs, setCalendarIDs] = useState(null);

  const formatEvents = (list) => {
      return list.map((item) => ({
        title: item.summary,
        start: item.start.dateTime || item.start.date,
        end: item.end.dateTime || item.end.date,
      }));
    };

  useEffect(() => {
      const script = document.createElement("script");
      script.async = true;
      script.defer = true;
      script.src = "https://apis.google.com/js/api.js";
  
      document.body.appendChild(script);
  
    }, []);
  
  const apiCalendar = new ApiCalendar(config)

  const authCal = () => {
      apiCalendar.handleAuthClick();
  }

  const showCalendars = () => {
      let calendarIDs = [];
      let calendarNames = [];

      apiCalendar.listCalendars().then(({ result }) => {
          console.log(result.items);
          result.items.forEach((event) => {
              let info = `Summary: ${event.summary}`;
              if (event.summaryOverride) {
                  info += `, Override: ${event.summaryOverride}`;
              }
              console.log(info);
              console.log(`ID: ${event.id}`)
              console.log()
              calendarIDs.push(event.id);
              calendarNames.push(event.summaryOverride ? event.summaryOverride : event.summary);
          })
      });
      setCalendarIDs(calendarIDs);
      setCalendarNames(calendarNames);
  }

  const showEvents = () => {
      calendarIDs.forEach( (id, i) => {
          listUpcomingEvents(id, calendarNames[i]);
      })
  }

  const listUpcomingEvents = (calendarID, calendarName) => {

    let minDate = new Date();
    let maxDate = new Date();

    minDate.setDate(minDate.getDate());
    maxDate.setDate(maxDate.getDate() + 20);

    window.gapi.client.calendar.events
      .list({
        calendarId: calendarID,
        timeMin: minDate.toISOString(),
        timeMax: maxDate.toISOString(),
        showDeleted: true,
        singleEvents: true,
        maxResults: 10,
        //orderBy: "startTime",
      })
      .then(function (response) {
        var events = response.result.items;//.reverse();

        console.log(`--------${calendarName}-------`);
        console.log("EVENTS:", events);
        
        events.forEach( (event) => {
            console.log(event.summary, event.start.dateTime.slice(0,10));
            console.log(`${event.start.dateTime.slice(12,)}`)
        })

        if (events.length > 0) {
          setEvents(formatEvents(events));
        }
      });
  };

  return (
      <React.Fragment>
          <a href="/">Home</a>

          <button onClick={authCal}>Authenticate Calendar</button>

          <button onClick={showEvents}>Show events</button>

          <button onClick={showCalendars}>Show calendars</button>

          <br />

      </React.Fragment>
  );
}

export default CalendarAPI