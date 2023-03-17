
# <a name="title" /> Meet & Cheese

## Introduction
Tired of comparing availability with every member for a group project or meeting? Meet & Cheese simplifies the process of finding the mutual availability times in a group trying to schedule a meeting time. Beyond seeing multiple group member's availability in one screen (pulled directly from their Google Calendars), Meet & Cheese also allows meeting organizers to select a final meeting time & send Google Calendar invitations to all meeting members.

## Usage

#### Setup

1 - Clone the master repository <br>```git clone https://github.com/cs35lproject/cs35l_project.git``` <br>
2 - Install Node.js [here](https://nodejs.org/en/download/) <br>
3 - See [Testing Phase](#testing-phase) to get client and server .env files, which contain private keys for the Google Calendar API and other private information necessary for the website to run <br>
4 - Open two terminals and navigate to the cloned repository, each will install the dependencies and run the corresponding code <br>

| server terminal  | client terminal |
| :-------------: |:-------------:|
| ```cd cs35l_project/server``` | ```cd cs35l_project/client ``` |
| ``` npm install ``` | ``` npm install ``` |
| ``` npm run dev ``` | ``` npm start ``` |

5 - If your client side code doesn't run successfully, read "Potential Installation Issues" below, and be sure your version of Node is up to date

#### Potential Installation Issues

A common error which occured was titled <br>
```Error message "error:0308010C:digital envelope routines::unsupported"``` <br>
Which was fixed by changing the the client side package.json run script to <br>
```"start": "react-scripts --openssl-legacy-provider start"``` <br>
from <br>
```"start": "react-scripts start"``` <br>
This is the default for our project, and should work if your version of node is up to date. <br>

However, the following error message occurs with older versions of node: <br>
```npm ERR! react-router-v6-example@0.1.0 start: `react-scripts --openssl-legacy-provider start```<br>
This can be fixed by simply setting the start script back to <br>
```"start": "react-scripts start"``` <br>


#### Testing-Phase

Until Meet & Cheese is considered an [officially verified](https://support.google.com/cloud/answer/7454865) app by Google, users will have to send the email corresponding to the calendar they want to use (send to ```sebastian01cevallos@gmail.com```) in order to be included in the testing phase. <br>

Additionally, if the website was hosted the .env file would be on that server but while in testing phase, please reach out to ```sebastian01cevallos@gmail.com``` to get a .env file which is up to date.

## Launch
Node.js v18.14.0 <br>
React.js v18.2.0 <br>
FullCalendar v6.1.4 <br>

#### [back to the top](#title)
