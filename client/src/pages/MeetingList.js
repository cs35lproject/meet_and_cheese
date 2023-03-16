import { json, useLocation, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import Navbar from "../components/Navbar"
import './style.css';
import './MeetingList.css'

import { Tabs, Tab, Box, Paper, Stack, styled } from '@mui/material';

import SearchBar from '../components/SearchBar';

export default function Meeting() {
  const { state } = useLocation();
  const [userID, setUserID] = useState(state ? state.userID : null);
  const [meetingMemberIDs, setMeetingMemberIDs] = useState(null);
  const [userMeetings, setUserMeetings] = useState();
  const [createdMeetings, setCreatedMeetings] = useState();
  const [trashMeetingID, setTrashMeetingID] = useState();

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
    if (trashMeetingID) 
      trashMeeting(trashMeetingID)
  }, [meetingMemberIDs])

  useEffect(() => {
    if (localStorage.getItem("userID")) {
      setUserID(localStorage.getItem("userID"))
    }
  }, []);

  useEffect(() => {
    getUser();
  }, [userID])

  // Get user from backend and update userMeetings hook
  const getUser = async () => {
    console.log("getUser()")
    if (userID !== null) {
      await new Promise(r => setTimeout(r, 400));
      if (userID !== undefined) {
        let url = `${process.env.REACT_APP_BACKEND}/user/getUserMeetings?userID=${userID}`
        let metadata = { method: "GET" }
        try {
          const response = await fetch(url, metadata)
          const data = await response.json()
          if (data.userID !== null && data.userMeetings !== null) {
            setUserMeetings(data.user.meetingIDs)
            setCreatedMeetings(data.user.createdMeetingIDs)
          }
        } catch (e) {
          console.log(e);
        }
      }
    }
  }

  const showCreatedMeetings = () => {
    let meetings = []
    let link = ""
    for (let meetingKey in createdMeetings) {
      link = `${window.location.origin}/meeting?id=${createdMeetings[meetingKey]}`;
      meetings.push(<div className="buttons-and-trash"><a href={link} key={meetingKey}>{link}</a>
                    <p style={{cursor: 'pointer'}}onClick={() => getMeeting(createdMeetings[meetingKey])}>🗑</p>
                    </div>);
    };
    return meetings
  }

  const getMeeting = async (meetingID) => {
    setTrashMeetingID(meetingID)
    let url = `${process.env.REACT_APP_BACKEND}/meeting/getMeeting?id=${meetingID}`
    let metadata = { method: "GET" }
    console.log(url, metadata)
    try {
      const response = await fetch(url, metadata)
      const data = await response.json()
      if (data.meeting !== undefined) {
        setMeetingMemberIDs(data.meeting.meetingMemberIDs)
      }
    } catch (e) {
      console.log(e);
    }
  }

  // MAY NEED TO CALL GETMEETING INSTEAD & MAKE TRASHMEETING DEPENDENCY IN USEEFFECT FOR meetingMemberIDs
  const trashMeeting = async (meetingKey) => {
    console.log("trashMeeting()")
    console.log(meetingMemberIDs)
    let url = "", body = "", metadata = {};

    url = `${process.env.REACT_APP_BACKEND}/user/detachMeeting`
    body = { "userID": userID, "meetingID": meetingKey}
    metadata = {
      method: "PUT", body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }
    }
    try {
      const response = await fetch(url, metadata)
      console.log("detach response:")
      console.log(response)
      if (response && response.user && response.user.meetingIDs) {
        setMeetingMemberIDs(response.user.meetingIDs);
        setCreatedMeetings(response.user.createdMeetingIDs);
        getUser();
      }
    } catch (e) {
      console.log(e);
    }
  }

  const showJoinedMeetings = () => {
    let meetings = []
    let link = ""
    for (let meetingKey in userMeetings) {
      if (createdMeetings && !createdMeetings.includes(userMeetings[meetingKey])) {
        link = `${window.location.origin}/meeting?id=${userMeetings[meetingKey]}`;
        meetings.push(<div className="buttons-and-trash"><a href={link} key={meetingKey}>{link}</a>
                      <p style={{cursor: 'pointer'}}onClick={() => getMeeting(userMeetings[meetingKey])}>🗑</p>
                      </div>);
      };
    }
    return meetings
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <React.Fragment>
      <div>
        <Navbar />
      </div>

      <div className="meetings-header">
      <h>Search for Users</h>
        <SearchBar userID={userID}></SearchBar>
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