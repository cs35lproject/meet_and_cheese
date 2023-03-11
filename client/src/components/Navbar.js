
import React from 'react';
import './Navbar.css'

class Navbar extends React.Component {

  constructor() {
    super();
    /* If user signs in with google, set state registered to false.
        Provide different navbar page options for signed in or signed out.
        
        default: signed out (get started, log in)
        signed in: (meet up, schedules, share, account)*/
    this.state = {
      registered: false,
    };
  }
 
  render() {
    return (
        <ul class = "navbar"> 
        <a href = "/" class = "title"  > 
            Meet & Cheese
        </a>
        <li> <a onClick={this.props.handleAuthClick} className="click">LOGIN</a></li>
        <li> <a href="/meeting">MEETINGS</a></li>
        <li> <a href="/getstarted">GET STARTED</a></li>
        </ul>
    )
  }
}

export default Navbar