import React from 'react';

import {Login} from '../components/Login';

class Calendar extends React.Component {

  constructor() {
    super();
    this.state = {
      calendarData : {}
    };
  }

  componentDidMount = () => {

  }

  render() {
    return (
      <React.Fragment>
        <a href="/meeting">Meeting Page</a>
        <a href="/CalendarAPI">CalendarAPI</a>

        <p>Calendar page will contain an empty calendar which will be filled in when signed in</p>

        <Login updateUserData={this.updateUserData} />

      </React.Fragment>
    )
  }
}

export default Calendar