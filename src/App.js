import React from 'react'
import Dashboard from './frontend/components/Dashboard'
import GroceryList from './frontend/components/GroceryList'
import Login from './frontend/components/Login'
import Signup from './frontend/components/Signup'
import Group from './frontend/components/Group'
import Profile from './frontend/components/Profile'
import ForgotPassword from './frontend/components/ForgotPassword'
import Fridge from './frontend/components/Fridge'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './backend/authContext'
import Protected from './backend/Protected'
import Discusion from './frontend/components/Discussion'
import Navbar from './frontend/components/Navbar'
import Calendar from './frontend/components/Calendar'
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#BBC4EB',
    },
    secondary: {
      main: '#DFE9EB',
    },
  },
});

function App() {
  return (
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <Navbar/>
          <Routes>
            <Route path='/' element={<Dashboard />} />
            <Route path='/Login' element={<Login />} />
            <Route path='/Signup' element={<Signup />} />
            <Route path='/Group' element={<Protected><Group /></Protected>} />
            <Route path='/Profile' element={<Protected><Profile /></Protected>} />
            <Route path='/ForgotPassword' element={<ForgotPassword />} />
            <Route path='/GroceryList' element={<Protected><GroceryList /></Protected>} />
            <Route path='/Fridge' element={<Protected><Fridge /></Protected>} />
            <Route path='/Discussion' element={<Protected><Discusion /></Protected>} />
            <Route path='/Calendar' element={<Protected><Calendar /></Protected>} />

          </Routes>
        </ThemeProvider>
        
      </AuthProvider>
  );
}

export default App