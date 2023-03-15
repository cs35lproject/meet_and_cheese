import { useLocation, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import Navbar from "../components/Navbar"
import './style.css';
import './MeetingList.css'

import { Tabs, Tab, Box, Paper, Stack, styled } from '@mui/material';

export default function Meeting() {
  const { state } = useLocation();
  const [userID, setUserID] = useState(state ? state.userID : null);
  const [userMeetings, setUserMeetings] = useState();
  const [createdMeetings, setCreatedMeetings] = useState();

  const [createdList, setCreatedList] = useState([])

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1.3),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    borderRadius: '2.5px',
  }));

  const [value, setValue] = useState('one');

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
      meetings.push(<div className="buttons-and-trash"><a href={link} key={meetingKey}>{link}</a>
                    <p style={{cursor: 'pointer'}}onClick={() => trashMeeting(userMeetings[meetingKey])}>🗑</p>
                    </div>)
    }
    console.log("meetings:", meetings)
    return meetings
  }

  const trashMeeting = (meetingKey) => {
    console.log(meetingKey, " deleted!!!");
  }

  const showJoinedMeetings = () => {
    console.log("userMeetings:", userMeetings)
    let meetings = []
    let link = ""
    for (let meetingKey in userMeetings) {
      if (createdMeetings && !createdMeetings.includes(userMeetings[meetingKey])) {
        link = `${window.location.origin}/meeting?id=${userMeetings[meetingKey]}`
        if (!createdList.includes(meetingKey))
        meetings.push(<div className="buttons-and-trash"><a href={link} key={meetingKey}>{link}</a>
                      <p style={{cursor: 'pointer'}}onClick={() => trashMeeting(userMeetings[meetingKey])}>🗑</p>
                      </div>)
      }
    }
    console.log("meetings:", meetings)
    return meetings
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const initCreatedList = () => {
    console.log("createdMeetings:", createdMeetings)
    let meetings = []
    for (let meetingKey in createdMeetings) {
      meetings.push(meetingKey);
    }
    setCreatedList(meetings);
  }


  return (
    <React.Fragment>
      {initCreatedList}
      <div>
        <Navbar />
      </div>

      <div className="meetings-header">
        <h>All Meetings</h>
        <p>{userID}</p>
      </div>

      <div className="preview">
        <div className="tabs-box">
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="secondary"
            indicatorColor="secondary"
            aria-label="secondary tabs example"
          >
            <Tab value="one" label="Created Meetings" />
            <Tab value="two" label="Joined Meetings" />
          </Tabs>
        </div>

        {value === 'one' &&
          <div className="meeting-wrapper">
            <div className="meetings-list">
              <Stack>
                {showCreatedMeetings().map((meeting, index) => (
                  <Item className="stack-style" key={index}>{meeting}</Item>
                ))}
              </Stack>
            </div>
          </div>
        }
        {value === 'two' &&
          <div className="meeting-wrapper">
            <div className="meetings-list">
              <Stack>
                {showJoinedMeetings().map((meeting, index) => (
                  <Item className="stack-style" key={index}>{meeting}</Item>
                  ))}
              </Stack>
            </div>
          </div>
        }
      </div>

    </React.Fragment>
  )
}