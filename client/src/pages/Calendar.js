import React from 'react';

import {Login} from '../components/Login';

class Calendar extends React.Component {

  constructor() {
    super();
    this.state = {
      firstName : '',
      lastName : '',
      gmail : ''
    };
  }

  updateUserData = (profileObj) => {
    console.log(profileObj)
    this.setState({
      firstName : profileObj.givenName,
      lastName : profileObj.familyName,
      gmail : profileObj.email
    });
  }
 
  render() {
    return (
      <React.Fragment>
        <a href="/meeting">Meeting Page</a>
        <a href="/CalendarAPI">CalendarAPI</a>
        <a href="/test">test</a>

        <p>Calendar page will contain an empty calendar which will be filled in when signed in</p>

        <p>firstName: {this.state.firstName}</p>
        <p>lastName: {this.state.lastName}</p>
        <p>gmail: {this.state.gmail}</p>

        <Login updateUserData={this.updateUserData} />

      </React.Fragment>
    )
  }
}

export default Calendar