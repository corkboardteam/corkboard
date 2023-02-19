import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { UserAuth } from "../../backend/auth_functions/authContext"
import { Form, Button, Card, Alert } from 'react-bootstrap'


const Dashboard = () => {
  const [error, setError] = useState('');
  const { currUser, logout } = UserAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    setError("")
    try {
      await logout();
      navigate('/');
    } catch {
      setError('Failed to log out');
    }
  }
  return (
    
    <div className="w-100 text-center mt-2">
        Go to Grocery List <Link to="/grocerylist">Grocery List</Link>
        <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Dashboard</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <strong>Email:</strong> {currUser.email}
          <Link to="/profile" className="btn btn-primary w-100 mt-3">
            Update Profile
          </Link>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        <Button variant="link" onClick={handleLogout}>
          Log Out
        </Button>
      </div>
    </div>
        /* <body>
          <table>
            <tr>
              <th>Item</th>
              <th>Stock</th>
              <th>Limit</th>
              <th>Where to buy</th>
            </tr>
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
          </table>
          <button>+</button>
          
        </body> */
    
  );
}

export default Dashboard;