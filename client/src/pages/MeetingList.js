import { useLocation, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import Navbar from "../components/Navbar"
import './style.css';
import './MeetingList.css'

export default function Meeting() {
  const { state } = useLocation();
  const [userID, setUserID] = useState(state ? state.userID : null);
  const [userMeetings, setUserMeetings] = useState();
  const [createdMeetings, setCreatedMeetings] = useState();

  useEffect(() => {
    if (localStorage.getItem("userID")) {
      setUserID(localStorage.getItem("userID"))
    }
  }, []);

  useEffect(() => {
    console.log("MeetingList useEffect getuser")
    getUser();
  }, [userID])
  
  // Get user from backend and update userMeetings hook
  const getUser = async () => {
    console.log("MeetingList getUser, userID:", userID)
    if (userID !== null) {
      await new Promise(r => setTimeout(r, 400));
      if (userID !== undefined) {
        let url = `${process.env.REACT_APP_BACKEND}/user/getUserMeetings?userID=${userID}`
        let metadata = { method: "GET" }
        console.log("url:", url)
        try {
            const response = await fetch(url, metadata)
            const data = await response.json()
            console.log("data:", data)
            if (data.userID !== null && data.userMeetings !== null) {
              console.log("setting user meetings to meeting id list:", data.user.meetingIDs)
              setUserMeetings(data.user.meetingIDs)
              setCreatedMeetings(data.user.createdMeetingIDs)
            }
        } catch (error) {
            console.log(error);
        }
      } 
    }
  }

  const showCreatedMeetings = () => {
    console.log("createdMeetings:", createdMeetings)
    let meetings = []
    let link = ""
    for (let meetingKey in createdMeetings) {
      link = `${window.location.origin}/meeting?id=${userMeetings[meetingKey]}`
      meetings.push(<div><a href={link} key={meetingKey}>{link}</a></div>)
    }
    console.log("meetings:", meetings)
    return meetings
  }

  const showJoinedMeetings = () => {
    console.log("userMeetings:", userMeetings)
    let meetings = []
    let link = ""
    for (let meetingKey in userMeetings) {
      if (createdMeetings && !createdMeetings.includes(userMeetings[meetingKey])) {
        link = `${window.location.origin}/meeting?id=${userMeetings[meetingKey]}`
        meetings.push(<div><a href={link} key={meetingKey}>{link}</a></div>)
      }
    }
    console.log("meetings:", meetings)
    return meetings
  }

  return (
    <React.Fragment>
      <div>
        <Navbar />
      </div>

      <p>Hi, {userID}. Here are your meetings:</p>

      <div id="meeting-wrapper">
        <div className="meetings-list">
          <p>Created Meetings</p>
          {showCreatedMeetings()}
        </div>

        <div className="meetings-list">
          <p>Joined Meetings</p>
          {showJoinedMeetings()}
        </div>
      </div>


  
    </React.Fragment>
  )
}