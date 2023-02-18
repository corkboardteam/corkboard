import React from 'react'
import { Container } from 'react-bootstrap'
import Dashboard from './frontend/pages/Dashboard'
import Login from './frontend/pages/Login'
import Signup from './frontend/pages/Signup'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './backend/custom_classes/authContext'

function App() {
  return (
    <Container style={{ maxWidth: "600px", marginTop: "2rem" }}>
      <AuthProvider>
        <Routes>
          <Route path = '/' element={<Login />} />
          <Route path = '/dashboard' element={<Dashboard />} />
          <Route path = '/signup' element={<Signup />} />
        </Routes>
      </AuthProvider>
    </Container>
  );
}

export default App