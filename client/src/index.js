import React from 'react';
import ReactDOM from 'react-dom/client';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';

import Calendar from './pages/Calendar'
import Meeting from './pages/Meeting'
import CalendarAPITestPage from './pages/CalendarAPITestPage'
import { handleAuthClick, handleClientLoad } from './components/CalendarAPI';
import './index.css';

import Navbar from "./components/Navbar/Navbar"
import GetStarted from './pages/GetStarted';
import AddPeople from './pages/AddPeople';

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
    path: '/addPeople',
    element: <AddPeople />,
  },
  {
    path: '/CalendarAPI',
    element: <CalendarAPITestPage />
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Navbar handleAuthClick = {handleAuthClick}/>
    <RouterProvider router={router} />
  </React.StrictMode>
);