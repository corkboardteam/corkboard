import React from 'react'
import { Container } from 'react-bootstrap'
import Dashboard from './frontend/pages/Dashboard'
import Login from './frontend/pages/Login'
import Signup from './frontend/pages/Signup'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './backend/custom_classes/authContext'

function App() {
  return (

    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h1 className='text-center text-3xl font-bold mt-8'>
        Corkboard
      </h1>
      <Container style={{ maxWidth: "400px", marginTop: "2rem" }}>
        <AuthProvider>
          <Routes>
            <Route exact path = '/' element={<Dashboard />} />
            <Route path = '/login' element={<Login />} />
            <Route path = '/signup' element={<Signup />} />
          </Routes>
        </AuthProvider>
      </Container>
    </div>
  );
}

export default App