import { useNavigate, useLocation } from 'react-router-dom'
import React, { useState, useEffect } from 'react';
import { handleClientLoad, handleAuthClick } from '../components/CalendarAPI';
import './Navbar.css'

const Navbar = (props) => {
  const [signinStatus, setSigninStatus] = useState(null);

  useEffect(() => {
    console.log("Navbar pathname:", window.location.pathname)
    if (window.location.pathname === "/join-meeting") {
      setSigninStatus("SIGN IN")
    }
    else{
      setSigninStatus("CREATE MEETING")
    }
  }, [])

  return (
    <ul class = "navbar"> 
    <a href = "/getstarted" class = "title"  > 
        Meet & Cheese
    </a>
    <li> <a onClick={props.handleAuthClick} className="click">{signinStatus}</a></li>
    <li> <a href="/list-meetings">LIST MEETINGS</a></li>
    <li> <a href="/">CALENDAR</a></li>
    </ul>
  )
}

export default Navbar