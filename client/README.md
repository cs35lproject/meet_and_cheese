
# <a name="title" /> Meet & Cheese

## Introduction
Tired of comparing availability with every member for a group project or meeting? Meet & Cheese simplifies the process of finding the mutual availability times in a group trying to schedule a meeting time. Beyond seeing multiple group member's availability in one screen (pulled directly from their Google Calendars), Meet & Cheese also allows meeting organizers to select a final meeting time & send Google Calendar invitations to all meeting members.

## Usage

#### Setup

1 - Clone the master repository <br>```git clone https://github.com/cs35lproject/cs35l_project.git``` <br>
2 - Install Node.js [here](https://nodejs.org/en/download/) <br>
3 - Open two terminals and navigate to the cloned repository, each will install the dependencies and run the corresponding code. <br>

| server terminal  | client terminal |
| :-------------: |:-------------:|
| ```cd cs35l_project/server``` | ```cd cs35l_project/client ``` |
| ``` npm install ``` | ``` npm install ``` |
| ``` npm run dev ``` | ``` npm start ``` |

4 - If your client side code doesn't run successfully, read "Potential Installation Issues" below, and be sure your version of Node is up to date.

#### Potential Installation Issues

A common error which occured was titled <br>
```Error message "error:0308010C:digital envelope routines::unsupported"``` <br>
Which was fixed by changing the the client side package.json run script to <br>
```"start": "react-scripts --openssl-legacy-provider start"``` <br>
from <br>
```"start": "react-scripts start"``` <br>
This is the default for our project, and should work if your version of node is up to date. <br>

However, the following error message occurs with older versions of node: <br>
```npm ERR! react-router-v6-example@0.1.0 start: `react-scripts --openssl-legacy-provider start```<br>
This can be fixed by simply setting the start script back to <br>
```"start": "react-scripts start"``` <br>


#### Testing Phase

Until Meet & Cheese is considered an [officially verified](https://support.google.com/cloud/answer/7454865) app by Google, users will have to send the email corresponding to the calendar they want to use (send to ```sebastian01cevallos@gmail.com```) in order to be included in the testing phase. <br>

Additionally, if the website was hosted the .env file would be on that server but while in testing phase, please reach out to ```sebastian01cevallos@gmail.com``` to get a .env file which is up to date.

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

#### IntersectionFind
The IntersectionFind module contains functions that find the union and intersection between two sets of intervals and a function that finds the intersection of the compliment of a set of time intervals with a second set of time intervals. The latter implements the former two and is the module's sole export. 

##### Implementation
```js
const intersectionFind = (events, intersections) => {

    //events is an nx2 array of the form [[start, end],.....]
    //intersections is an nx2 array of the form [[start, end],.....]

    //Assume evenStarts and eventEnds are all relative to Unix epoch
    //I.e. no time zones etc

    //Assume that all the events are in the relevant search area
    //If not, the algorithm will still work but will be slow
    //I.e. will find intersections that aren't relevant

    //Merge intervals
    //Handle the case where some events overlap eachother
    events = union(events);

    //Find the new available times
    //Simply find the intervals in between the event intervals
    let myintersections = []
    for (let i=0; i<events.length - 1; i++){
        myintersections.push([events[i][1], events[i+1][0]]);
    }

    //Intersect intersections
    //Find the intersection between current and previous free times
    intersections = intersection(intersections, myintersections);

    //Merge intersections
    //Handle the case where some intersections overlap eachother
    intersections = union(intersections);

    return intersections;
}
```
##### Notes
- IntersectionFind is implemented on the client side to minimize data transmission between the client and the server.
- All times are assumed to be integers and UNIX epoch timestamps by convention.
- The intersections parameter of IntersectionFind can be initialized to be a set of constraints on meeting times (e.g. daily between 2pm and 4pm this week).

The loadValues function / FullCalendar object which is being rendered / savedEvents flow / any of the cool FullCalendar features Juan made, talk about it a bit in the same format as I did.

## Launch
Node.js v18.14.0 <br>
React.js v18.2.0 <br>
FullCalendar v6.1.4 <br>

#### [back to the top](#title)
