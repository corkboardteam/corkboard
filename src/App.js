import React from 'react'
import { Container } from 'react-bootstrap'
import Dashboard from './frontend/pages/Dashboard'
import GroceryList from './frontend/pages/GroceryList'
import Login from './frontend/pages/Login'
import Signup from './frontend/pages/Signup'
import Profile from './frontend/pages/Profile'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './backend/auth_functions/authContext'
import TestClass from './backend/custom_classes/test_custom_class/testclass';
function App() {
  return (
    <Container style={{ maxWidth: "600px", marginTop: "2rem" }}>
      <AuthProvider>
        <Routes>
          <Route path = '/' element={<Login />} />
          <Route path = '/dashboard' element={<Dashboard />} />
          <Route path = '/signup' element={<Signup />} />
          <Route path = '/profile' element={<Profile />} />
          <Route path = '/grocerylist' element={<GroceryList />} />
        </Routes>
      </AuthProvider>
    </Container>
  );
}

export default App