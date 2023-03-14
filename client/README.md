# <a name="title" /> Meet & Cheese Frontend

# <a name="title" /> Sorting Visualizer

## Introduction
Tired of comparing availability all the time? Meet & Cheese simplifies the process of finding the mutual availability times in a group trying to schedule a meeting time. Beyond seeing multiple group member's availability in one screen (pulled directly from their Google Calendars), Meet & Cheese also allows meeting organizers to select a final meeting time & send Google Calendar invitations to all meeting members.

## Usage

#### Setup

1 - Clone the master repository (```git clone https://github.com/cs35lproject/cs35l_project.git```) <br>
2 - Install Node.js [here](https://nodejs.org/en/download/) <br>
3 - Open two terminals and navigate to the frontend & backend directories, install all dependencies, and run the frontend & backend with the following commands: 
Terminal 1 (install & start backend):
```cd cs35l_project/backend```
```npm install```
```npm run dev```
Terminal 2 (install & start frontend):
```cd cs35l_project/frontend```
```npm install```
``` npm start```

#### Previews

#### Technical Information

Meet & Cheese uses the MERN stack; MongoDB, Express, React, and Node. In order to provide the simplest user interface, we combined these frameworks with the (Google Calendar API)[https://developers.google.com/calendar/api/guides/overview], and a React graphics package called (FullCalendar)[https://fullcalendar.io/]. The main 2 pages in the website are Calendar.js and Meeting.js, although the JoinMeeting.js page may be used when sharing a meeting with others. Each Google Calendar API call is made using components inside the CalendarAPI component.


Although the CalendarAPI component is split into several sections, the main portion which assits in the retrieval of a user's calendars and events is the following code segment:

```js
let tempCalendars = [];
let events = []
let primaryEmail = ""
let curCalendar;
if (gapi) {
    gapi.client.calendar.calendarList.list()
    .then( ({ result }) => {
        result.items.forEach((calendar) => {
            if (calendar.primary) {
                primaryEmail = calendar.id
            }
            curCalendar = {};
            curCalendar.name = calendar.summaryOverride ? calendar.summaryOverride : calendar.summary;
            curCalendar.id = calendar.id
            setEvents(curCalendar, events, daysAhead, maxResults);
            tempCalendars.push(curCalendar);
        })
        calendarsData(tempCalendars, events, primaryEmail);
    });
}
```

This loops through every calendar which is sent back from the Google Calendar API (given by `gapi.client.calendar.calendarList.list()`), creates a new JavaScript object with only the Calendar's name and ID (since the original calendar object contains excessive information), adds the object to a list of such objects and pushes it to a list of all calendars. It then calls setEvents which does something similar for every event in the calendar and adds it to the new curCalendar object. This list is passed into a callback function called calendarsData which exists in Calendar.js, which then passes that calendar data to the intersectionFind component.

The intersectionFind component assists in ... (Yassin, actually read where we use this in the frontend & write about it)

The loadValues function / FullCalendar object which is being rendered / savedEvents flow / any of the cool FullCalendar features Juan made, talk about it a bit in the same format as I did.

## Launch
Node.js v18.14.0 <br>
React.js v18.2.0 <br>
FullCalendar v6.1.4 <br>

#### [back to the top](#title)
