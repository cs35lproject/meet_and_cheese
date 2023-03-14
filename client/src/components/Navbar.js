import { useNavigate, useLocation } from 'react-router-dom'
import React, { useState, useEffect } from 'react';
import './Navbar.css'

const Navbar = (props) => {
  const navigate = useNavigate()
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

  const loadCalendar = () => {
    navigate("/")
    props.handleAuthClick();
  }

  const chooseAuthentication = () => {
    console.log("signinStatus", signinStatus)
    if (signinStatus === "CREATE MEETING") {
      return <li> <a onClick={loadCalendar} className="click">{signinStatus}</a></li>
    }
    else if (signinStatus === "SIGN IN") {
      return <li> <a onClick={props.handleAuthClick} className="click">{signinStatus}</a></li>
    }
    else {
      return <p>none</p>
    }
  }

  return (
    <ul class = "navbar"> 
    <a href = "/" class = "title"  > 
        Meet & Cheese
    </a>
    {chooseAuthentication()}
    <li> <a href="/list-meetings">LIST MEETINGS</a></li>
    <li> <a href="/getstarted">GET STARTED</a></li>
    </ul>
  )
}

export default Navbar