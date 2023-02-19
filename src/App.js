import React from 'react'
import { Container } from 'react-bootstrap'
import Dashboard from './frontend/components/Dashboard'
import GroceryList from './frontend/components/GroceryList'
import Login from './frontend/components/Login'
import Signup from './frontend/components/Signup'
import Group from './frontend/components/Group'
import Profile from './frontend/components/Profile'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './backend/auth_functions/authContext'
import TestClass from './backend/custom_classes/test_custom_class/testclass';
import ForgotPassword from './frontend/components/ForgotPassword'

function App() {
  return (
    <Container style={{ maxWidth: "600px", marginTop: "2rem" }}>
      <AuthProvider>
        <Routes>
          <Route path = '/' element={<Login />} />
          <Route path = '/dashboard' element={<Dashboard />} />
          <Route path = '/signup' element={<Signup />} />
          <Route path = '/group' element={<Group />} />
          <Route path = '/profile' element={<Profile />} />
          <Route path = '/forgot-password' element={<ForgotPassword />} />
          <Route path = '/grocerylist' element={<GroceryList />} />
        </Routes>
      </AuthProvider>
    </Container>
  );
}

export default App