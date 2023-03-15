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
      setSigninStatus("Sign In")
    }
  }, [])

  const loadCalendar = () => {
    console.log("loadCalendar", window.location.pathname)
    if (window.location.pathname === "/") {
      props.handleAuthClick();
    }
    else {
      navigate("/",
      { state : {doAuthClick : true} })
    }
  }

  const chooseAuthentication = () => {
    console.log("signinStatus", signinStatus)
    if (signinStatus === "Sign In") {
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
    <a href = "/" class = "title">Meet & Cheese</a>
    <li> <a href="/getstarted">About</a></li>
    <li> <a href="/list-meetings">Meetings List</a></li>
    {chooseAuthentication()}
    </ul>
  )
}

export default Navbar