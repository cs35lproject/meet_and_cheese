import { useNavigate, useLocation } from 'react-router-dom'
import React, { useState, useEffect } from 'react';
import './Navbar.css'

const Navbar = (props) => {
  const navigate = useNavigate()
  const [signinStatus, setSigninStatus] = useState(null);

  useEffect(() => {
    /*
    if (window.location.pathname === "/join-meeting") {
      setSigninStatus("SIGN IN")
    }
    */
    if (window.location.pathname === "/join-meeting") {
      setSigninStatus("")
    }
    else if (window.location.pathname === "/") {
      setSigninStatus("")
    }
    else{
      setSigninStatus("Create Meeting")
    }
    /*
    else{
      setSigninStatus("Sign In")
    }
    */
  }, [])

  const loadCalendar = () => {
    if (window.location.pathname === "/") {
      props.handleAuthClick();
    }
    else {
      navigate("/",
      { state : {doAuthClick : true} })
    }
  }

  const chooseAuthentication = () => {
    if (signinStatus === "Create Meeting") { 
      return <li> <a onClick={loadCalendar} className="click">{signinStatus}</a></li>
    }
    else if (signinStatus === "SIGN IN") { 
      return <li> <a onClick={props.handleAuthClick} className="click">{signinStatus}</a></li>
    }
    else {
      return
    }
  }

  return (
    <ul className="navbar"> 
    <a href = "/" class="title">🧀 Meet & Cheese</a>
    <li> <a href="/getstarted">About</a></li>
    <li> <a href="/list-meetings">Meetings List</a></li>
    {chooseAuthentication()}
    </ul>
  )
}

export default Navbar