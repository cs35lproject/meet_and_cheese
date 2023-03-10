import React, { useState, useEffect } from 'react';
import { handleClientLoad, handleAuthClick } from '../components/CalendarAPI';

/*
only need id to retrieve user from database
id should be given by google
*/

const config = {
  "clientId": process.env.REACT_APP_CLIENT_ID,
  "apiKey": process.env.REACT_APP_API_KEY,
  "scope": process.env.REACT_APP_SCOPE,
  "discoveryDocs": [process.env.REACT_APP_DISCOVERY_DOCS]
};

const scriptSrcGoogle = "https://accounts.google.com/gsi/client";
const scriptSrcGapi = "https://apis.google.com/js/api.js";

const CalendarAPITestPage = (props) => {

  const gapi = window.gapi;
  var tokenClient =  null;
  var onLoadCallback = null;
  const [fullCalendars, setFullCalendars] = useState(null);

  useEffect(() => {
    
    }, []
  );

  const handleClientLoad = () => {
    const scriptGoogle = document.createElement("script");
    const scriptGapi = document.createElement("script");
    scriptGoogle.src = scriptSrcGoogle;
    scriptGoogle.async = true;
    scriptGoogle.defer = true;
    scriptGapi.src = scriptSrcGapi;
    scriptGapi.async = true;
    scriptGapi.defer = true;
    document.body.appendChild(scriptGapi);
    document.body.appendChild(scriptGoogle);
    scriptGapi.onload = () => {
      gapi.load("client", initGapiClient);
    };
    scriptGoogle.onload = async () => {
        tokenClient = await window.google.accounts.oauth2.initTokenClient({
        client_id: config.clientId,
        scope: config.scope,
        prompt: "",
        callback: () => {setCalendars()},
      });
    };
  }

  const initGapiClient = () => {
    gapi.client
      .init({
        apiKey: config.apiKey,
        discoveryDocs: config.discoveryDocs,
        hosted_domain: config.hosted_domain,
      })
      .then( () => {
        if (onLoadCallback) {
          onLoadCallback();
        }
      })
      .catch( (e) => {
        console.log(e);
      });
  }

  const handleAuthClick = () => {
    if (gapi && tokenClient) {
        if (gapi.client.getToken() === null) {
          tokenClient.requestAccessToken({ prompt: "consent" });
        } else {
          tokenClient.requestAccessToken({
            prompt: "",
          });
        }
      } else {
        console.error("Error: gapi not loaded");
        new Error("Error: gapi not loaded");
      }
  }

  const setCalendars = () => {
    console.log("CALLED SET CALENDARS")
    let tempCalendars = [];
    let curCalendar;

    if (gapi) {
        gapi.client.calendar.calendarList.list()
        .then( ({ result }) => {
            result.items.forEach((calendar) => {
              curCalendar = {};
              // Set calendar summary
              curCalendar.name = calendar.summaryOverride ? calendar.summaryOverride : calendar.summary;
              // Set calendar ID
              curCalendar.id = calendar.id
      
              // Set events for calendar
              setEvents(curCalendar);
      
              console.log(curCalendar.name, curCalendar)
      
              // Save to list of calendars
              tempCalendars.push(curCalendar);
            })
            setFullCalendars(tempCalendars);
          });
          return tempCalendars;
    }
  }

  const setEvents = (calendar) => {
    let daysAhead = props.daysAhead ? props.daysAhead : 10;
    let maxResults = props.maxResults ? props.maxResults : 30;

    let minDate = new Date();
    let maxDate = new Date();

    minDate.setDate(minDate.getDate());
    maxDate.setDate(maxDate.getDate() + daysAhead);

    gapi.client.calendar.events
      .list({
        calendarId: calendar.id,
        timeMin: minDate.toISOString(),
        timeMax: maxDate.toISOString(),
        showDeleted: true,
        singleEvents: true,
        maxResults: maxResults,
        orderBy: "startTime",
      })
      .then( (response) => {
        calendar.events = response.result.items;
      });
  };

  const fetchGetReq = (url) => {
    fetch(url, {method:"GET"})
    .then( (res) => res.json())
    .then( (data) => {
      console.log(data)
    })
    .catch( (e) => {
      console.log(e)
    })
  }

  const fetchPostReq = (url, metadata) => {
    console.log("called post req, metadata:")
    console.log(metadata)
    fetch(url, metadata)
    .then( (res) => res.json())
    .then( (data) => {
      console.log(data)
    })
    .catch( (e) => {
      console.log(e)
    })
  }

  const getUserEvents = (user) => {
    let id = "id2"
    let url = `http://localhost:7073/api/user/userEvents/?id=${id}`
    fetchGetReq(url)
  }

  const createUser = () => {
    console.log("inside create user frontend")
    let body = {
      _id : "id2",
      name : "name2",
      email : "email2",
      events : [[1,2],[3,4]]
    }
    let url = "http://localhost:7073/api/user/createUser"
    const reqMetaData = {
      method: "POST",
      body: JSON.stringify(body),
      headers: {'Content-Type': 'application/json'}
    }
    fetchPostReq(url, reqMetaData)
  }

  const getTest = () => {
    let url = "http://localhost:7073/api/testroute/getTest"
    fetchGetReq(url)
  }

  const postTest = () => {
    let body = {
      "calendarID": "some id here",
      "username": "some username here"
    }

    let url = "http://localhost:7073/api/testroute/postTest"
    let metadata = {
      method: "POST",
      body: JSON.stringify(body),
      headers: {'Content-Type': 'application/json'}
    }

    fetchPostReq(url, metadata)
  }

  const sendToAPI = () => {
    /*
    sample userEvents:
    http://localhost:7073/api/user/userEvents/?user=name
    */
    let url =     'http://localhost:7073/api/user/userEvents'
    url =         'http://localhost:7073/api/user/createUser'
    url = 'http://localhost:7073/api/user/userEvents/?user=name'

    const body = {
      _id : "id",
      name : "name",
      email : "email",
      events : [[1,2],[3,4]]
    }
    //getUserEvents("name", body)
  //   const requestMetadata = {
  //       method: 'POST',
  //       headers: {
  //           'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify(body)
  //   };
    
    // fetch(url, {
    //   method: 'GET',
    // })
    //     .then(res => res.json())
    //     .then( (data) => {
    //       console.log(data)
    //     .catch( (e) => {
    //       console.log("err:", e)
    //     })
    // });
  }

  return (
      <React.Fragment>

        <div>
        <a href="/">Home</a>

<button onClick={handleAuthClick}>auth</button>

<button onClick={sendToAPI}>send to api</button>

<button onClick={createUser}>create user</button>
<button onClick={getUserEvents}>get user events</button>
        </div>
        <div>
          <button onClick={getTest}>test get</button>
          <button onClick={postTest}>test post</button>
        </div>

        <button onClick={handleAuthClick}>Sign in</button>

          <br />

      </React.Fragment>
  );
}

export default CalendarAPITestPage