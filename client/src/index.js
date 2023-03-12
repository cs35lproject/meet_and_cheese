import React from 'react';
import ReactDOM from 'react-dom/client';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';

import Calendar from './pages/Calendar'
import Meeting from './pages/Meeting'
import JoinMeeting from './pages/JoinMeeting';
import './index.css';

import GetStarted from './pages/GetStarted';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Calendar />,
  },
  {
    path: '/getstarted',
    element: <GetStarted />,
  },
  {
    path: '/meeting',
    element: <Meeting />,
  },
  {
    path: '/join-meeting',
    element: <JoinMeeting />,
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);