# <a name="title" /> Meet & Cheese

## Introduction
Tired of comparing availability all the time? Meet & Cheese simplifies the process of finding the mutual availability times in a group trying to schedule a meeting time. Beyond seeing multiple group member's availability in one screen (pulled directly from their Google Calendars), Meet & Cheese also allows meeting organizers to select a final meeting time & send Google Calendar invitations to all meeting members.

## Usage

#### Setup
1 - Clone the master repository (```git clone https://github.com/cs35lproject/cs35l_project.git```) <br>
2 - Install Node.js [here](https://nodejs.org/en/download/) <br>
3 - Open two terminals and navigate to the frontend & backend directories, install all dependencies, and run the frontend & backend with the following commands: 
Terminal 1 (install & start backend):
```cd cs35l_project/backend```
```npm install```
```npm run dev```
Terminal 2 (install & start frontend):
```cd cs35l_project/frontend```
```npm install```
``` npm start```
4 - Until Meet&Cheese is [officially verified by Google](https://support.google.com/cloud/answer/7454865), user's emails must be added in order to use the Google Calendar API. Unless explicitly confirmed that the correct email was added, expect to recieve errors whenever a user attempts to log in using Google.

#### Technical Information
The backend is split into controllers, models, and routes, which are all connected inside app.js. 

The models folder contains the model of each kind of object to be stored in the MongoDB database. For example, this is the user model:
```js
const userSchema = new mongoose.Schema({
    userID : {
        type: String,
        required: true
    },
    meetingIDs : {
        type : [String],
        required : false
    },
    createdMeetingIDs : {
        type : [String],
        required: false
    },

}, {timestamps : true});
```

These objects can be retrieved with functions inside the controllers folder. There are functions which handle each important kind of HTTP request relavent to retrieving meeting or user information. 

Finally, the routes folder tells app.js which functions to call depending on what HTTP request was recieved with a specific URL.

## Launch
Node.js v18.14.0 <br>
React.js v18.2.0 <br>
FullCalendar v6.1.4 <br>

#### [back to the top](#title)
