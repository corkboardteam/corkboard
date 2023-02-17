import React from 'react';
import ReactDOM from 'react-dom/client';
import './frontend/styles/index.css';
import App from './App';
import TestClass from './backend/custom_classes/test_custom_class/testclass';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/test",
    element: <TestClass />,
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

