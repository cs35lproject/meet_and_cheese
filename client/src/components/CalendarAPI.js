export const config = {
  "clientId": process.env.REACT_APP_CLIENT_ID,
  "apiKey": process.env.REACT_APP_API_KEY,
  "scope": process.env.REACT_APP_SCOPE,
  "discoveryDocs": [process.env.REACT_APP_DISCOVERY_DOCS]
};

const gapi = window.gapi
const scriptSrcGoogle = "https://accounts.google.com/gsi/client";
const scriptSrcGapi = "https://apis.google.com/js/api.js";

var tokenClient =  null;
var onLoadCallback = null;

const handleClientLoad = (calendarsData, daysAhead, maxResults) => {
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
        callback: () => {
            setCalendars(calendarsData, daysAhead, maxResults);
        },
        });
    };
}

const initGapiClient = () => {
    gapi.client.init({
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

const setCalendars = (calendarsData, daysAhead, maxResults) => {
    let tempCalendars = [];
    let events = []
    let primaryEmail = ""
    let curCalendar;
    if (gapi) {
        gapi.client.calendar.calendarList.list()
        .then( ({ result }) => {
            result.items.forEach((calendar) => {
                if (calendar.primary) {
                    primaryEmail = calendar.id
                }
                curCalendar = {};
                curCalendar.name = calendar.summaryOverride ? calendar.summaryOverride : calendar.summary;
                curCalendar.id = calendar.id
                setEvents(curCalendar, events, daysAhead, maxResults);
                tempCalendars.push(curCalendar);
            })
            calendarsData(tempCalendars, events, primaryEmail);
        });
    }
}

const setEvents = (calendar, events, givenDaysAhead, givenMaxResults) => {
    let daysAhead = givenDaysAhead ? givenDaysAhead : 10;
    let maxResults = givenMaxResults ? givenMaxResults : 30;

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
        for (const key in response.result.items) {
            let startTime = response.result.items[key].start.dateTime
            let endTime = response.result.items[key].end.dateTime
            let times = {"start" : startTime, "end" : endTime}
            events.push(times)
        }
        calendar.events = Array.from(response.result.items)
    });
};

export { handleClientLoad, handleAuthClick }