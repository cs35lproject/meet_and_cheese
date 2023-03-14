import { useNavigate, useLocation } from 'react-router-dom'
import React, { useState, useEffect } from 'react';
import { handleClientLoad, handleAuthClick } from '../components/CalendarAPI';
import './Navbar.css'

const Navbar = (props) => {
  return (
    <ul class="navbar">
      <a href="/" class="title"  >
        Meet & Cheese
      </a>
      <li> <a onClick={props.handleAuthClick} className="click">{props.status ? "Create Meeting" : "Sign In"}</a></li>
      <li> <a href="/list-meetings">List Meetings</a></li>
      <li> <a href="/getstarted">Get Started</a></li>
    </ul>
  )
}

export default Navbar