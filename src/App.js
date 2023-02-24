import React from 'react'
import { Container } from 'react-bootstrap'
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


function App() {
  return (
    <Container style={{ maxWidth: "600px", marginTop: "2rem" }}>
      <AuthProvider>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/dashboard' element={<Protected><Dashboard /></Protected>} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/group' element={<Protected><Group /></Protected>} />
          <Route path='/profile' element={<Protected><Profile /></Protected>} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/grocerylist' element={<Protected><GroceryList /></Protected>} />
          <Route path='/fridge' element={<Protected><Fridge /></Protected>} />
          <Route path='/discussion' element={<Protected><Discusion /></Protected>} />
        </Routes>
      </AuthProvider>
    </Container>
  );
}

export default App