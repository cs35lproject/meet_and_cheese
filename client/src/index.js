import React from 'react';
import ReactDOM from 'react-dom/client';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';

import FCalendar from './pages/FCalendar'
import FMeeting from './pages/FMeeting'
import './index.css';

import GetStarted from './pages/GetStarted';

const router = createBrowserRouter([
  {
    path: '/',
    element: <FCalendar />,
  },
  {
    path: '/getstarted',
    element: <GetStarted />,
  },
  {
    path: '/meeting',
    element: <FMeeting />,
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);