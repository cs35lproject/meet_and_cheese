import React from 'react';
import './style.css';

import Navbar from "../components/Navbar"

import { handleClientLoad, handleAuthClick, config } from '../components/CalendarAPI';

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // plugin
import googleCalendarPlugin from '@fullcalendar/google-calendar'
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import './style.css'

// class Meeting extends React.Component {
//   render() {
//     return (
//       <React.Fragment>
//         <div>
//           <Navbar/>
//         </div>

//         <a href="/">Home</a>
//         <p>Page containing full availability data from all meeting participants</p>
//         <p>These should be *centered* buttons and  also look better</p>
//         <meeting>
//             <div class="row">
//                 <div class="column">
//                     <div class="circle"></div>
//                     <h2>Default View</h2>
//                 </div>
//                 <div class="column">
//                     <div class="circle"></div>
//                     <h2>Meeting View</h2>
//                 </div>
//             </div>
//         </meeting>
//       </React.Fragment>
//     )
//   }
// }


class Meeting extends React.Component {

  constructor() {
    super();
    this.state = {
      calendarsData : null,
      events : [],
      intersections : [],
      eventsArray : []
    };
  }

  componentDidMount = () => {
    handleClientLoad(this.setCalendarsData);
  }

  setCalendarsData = async (tempCalendarsData, events) => {
    this.setState({calendarsData : tempCalendarsData, events : events}) 
    await new Promise(r => setTimeout(r, 500));
    this.showCalendars()
  }

  showCalendars = async () => {
    let events = this.state.events.map(event => [!isNaN(Date.parse(event.start)) ? Date.parse(event.start) : 0, !isNaN(Date.parse(event.end)) ? Date.parse(event.end) : 0])
    let body = {"events":events}
    let url = process.env.REACT_APP_BACKEND
    let metadata = {
      method: "POST",
      body: JSON.stringify(body),
      headers: {'Content-Type': 'application/json'}
    }
    fetch(url, metadata)
    .then( (res) => res.json())
    .then( (data) => {
      this.setState({intersections : data.new_intersection})
      this.updateAvailability()
    })
    .catch( (e) => {
      console.log(e)
    })
  }

  updateAvailability = async () => {
    await new Promise(r => setTimeout(r, 500));
    let _events = [];
    const timeNow = Date.now();
    console.log("Time now: ", timeNow);
    for (const start_end of this.state.intersections) {
      // only dates STARTING from TODAY
      // if end time is less than time now, get rid of the event
      if (start_end[1] < timeNow) continue;
      const _event = {
        title: "Available",
        start: start_end[0],
        end: start_end[1]
      };
      _events.push(_event);
    }
    this.setState({ eventsArray: _events });
    /* 
    use this.state.new_intersection for unix timestamps to create calendar events to represent user's availability
    */
  }

  handleEventClick = (arg) => {
    console.log("start: ", arg.event.start," end: ", arg.event.end, " title: ", arg.event.title)
  }

  handleMouseEnter = (arg) => {
    arg.el.classList.add('event_hover'); // Add custom class on mouse enter
  }

  handleMouseLeave = (arg) => {
    arg.el.classList.remove('event_hover'); // Add custom class on mouse enter
  }

  handleEventResize = (arg) => {
    const event = arg.event;
    const start = event.start;
    const end = event.end;
    const duration = end - start;
    const newStart = arg.start;
    const newEnd = new Date(newStart.getTime() + duration);
    event.setStart(newStart);
    event.setEnd(newEnd);
  }

  render() {
    return (
      <React.Fragment>
        <div>
          <Navbar handleAuthClick = {handleAuthClick}/>
        </div>
        <div class="box_container">
          <div class="box">
          <div className="circle"><p2>SHARE</p2></div>
            <div className="rectangle2">
              <h4>Users</h4>
              {/* <p>placeholder</p> */}
            </div>
          </div>
          <calendar2>
            <div class="square"></div>
            <FullCalendar
              plugins={[ dayGridPlugin, googleCalendarPlugin, timeGridPlugin ]}
              initialView="timeGridWeek"
              allDaySlot={false}
              eventColor={'#378006'}
              googleCalendarApiKey={config.apiKey}
              // auto gets rid of need for scrolling for contentHeight
              contentHeight="auto" 
              height="auto"
              eventClick={this.handleEventClick}
              eventMouseEnter={this.handleMouseEnter}
              eventMouseLeave={this.handleMouseLeave}
              handleWindowResize={true}
              slotMinTime="06:00:00"
              slotMaxTime="22:00:00"
              events ={this.state.eventsArray}
              editable={true}
              eventResize={this.handleEventResize}
            />
          </calendar2>
        </div>
      </React.Fragment>
      
    )
  }
}
export default Meeting