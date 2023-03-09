import React from 'react'
import Dashboard from './frontend/components/Dashboard'
import GroceryList from './frontend/components/GroceryList'
import Login from './frontend/components/Login'
import Signup from './frontend/components/Signup'
import Group from './frontend/components/Group'
import Profile from './frontend/components/Profile'
import ForgotPassword from './frontend/components/ForgotPassword'
import Fridge from './frontend/components/Fridge'
import { useLocation, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './backend/authContext'
import Protected from './backend/Protected'
import Discusion from './frontend/components/Discussion'
import LandingPage from './frontend/components/LandingPage'
import Navbar from './frontend/components/Navbar'
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
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),

    // button: {
    
    // },
    
  },
    
});

function App() {
  const location = useLocation();

  return (
      <AuthProvider>
        <ThemeProvider theme={theme}>
          {location.pathname !== '/Login' && location.pathname !== '/Signup' && <Navbar />}
          <Routes>
            <Route path='/LandingPage' element={<LandingPage />} />
            <Route path='/' element={<Dashboard />} />
            <Route path='/Login' element={<Login />} />
            <Route path='/Signup' element={<Signup />} />
            <Route path='/Group' element={<Protected><Group /></Protected>} />
            <Route path='/Profile' element={<Protected><Profile /></Protected>} />
            <Route path='/ForgotPassword' element={<ForgotPassword />} />
            <Route path='/GroceryList' element={<Protected><GroceryList /></Protected>} />
            <Route path='/Fridge' element={<Protected><Fridge /></Protected>} />
            <Route path='/Discussion' element={<Protected><Discusion /></Protected>} />
          </Routes>
        </ThemeProvider>
      </AuthProvider>
  );
}

export default App