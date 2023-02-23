import React from 'react'
import { Container } from 'react-bootstrap'
import Dashboard from './frontend/components/Dashboard'
import GroceryList from './frontend/components/GroceryList'
import Login from './frontend/components/Login'
import Signup from './frontend/components/Signup'
import Group from './frontend/components/Group'
import Profile from './frontend/components/Profile'
import ForgotPassword from './frontend/components/ForgotPassword'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './backend/authContext'
import Protected  from './backend/Protected'
import TestClass from './backend/custom_classes/test_custom_class/testclass';


function App() {
  return (
    /*
    <body>
      <div class="container">
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Stock</th>
              <th>Limit</th>
              <th>Where to buy</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>eggs</td>
              <td>ten eggs</td>
              <td>sixty eggs</td>
              <td>Ralphs</td>
            </tr>
            <tr>
              <td>oatmeal</td>
              <td>zero</td>
              <td>three canisters</td>
              <td>Target</td>
            </tr>
            <tr>
              <td>milk</td>
              <td>one gallon</td>
              <td>two gallons</td>
              <td>Ralphs</td>
            </tr>
            <tr>
              <td>spinach</td>
              <td>one bag</td>
              <td>three bags</td>
              <td>Whole Foods</td>
            </tr>
          </tbody>
        </table>
      </div>
      <button>+</button>
    </body>
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
    */
    <Container style={{ maxWidth: "600px", marginTop: "2rem" }}>
      <AuthProvider>
        <Routes>
          <Route path = '/' element={<Login />} />
          <Route path = '/dashboard' element={<Protected><Dashboard /></Protected>} />
          <Route path = '/signup' element={<Signup />} />
          <Route path = '/group' element={<Protected><Group /></Protected>} />
          <Route path = '/profile' element={<Protected><Profile /></Protected>} />
          <Route path = '/forgot-password' element={<ForgotPassword />} />
          <Route path = '/grocerylist' element={<Protected><GroceryList /></Protected>} />
        </Routes>
      </AuthProvider>
    </Container>
  );
}

export default App