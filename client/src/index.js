import React from 'react';
import ReactDOM from 'react-dom/client';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';

import Calendar from './pages/Calendar'
import Meeting from './pages/Meeting'
import CalendarAPITestPage from './pages/CalendarAPITestPage'
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Calendar />,
  },
  {
    path: '/meeting',
    element: <Meeting />,
  },
  {
    path: '/CalendarAPI',
    element: <CalendarAPITestPage />
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);