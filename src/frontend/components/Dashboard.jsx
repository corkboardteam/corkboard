import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { UserAuth } from "../../backend/authContext"

const Dashboard = () => {
  const [error, setError] = useState('');
  const { currentUser, logout } = UserAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
    } 
    console.log(currentUser)
  },[currentUser, navigate]);

  async function handleLogout() {
    setError('')
    try {
      await logout();
      navigate('/');
    } catch {
      setError('Failed to log out');
    }
  }
  return (
  
    <div className="container">
      <div className="w-100 text-center mt-2">
        Using Corkboard with family or friends? <Link to="/group">Join/Create a Group</Link>
      </div>
      <div className="w-100 text-center mt-2">
        Go to Grocery List <Link to="/grocerylist">Grocery List</Link>
      </div>
      <div className="card">
        <div className="card-body">
          <h2 className="text-center mb-4">Dashboard</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <strong>Email:</strong> {currentUser.email}
          <Link to="/profile" className="btn btn-primary w-100 mt-3">
            Edit Profile
          </Link>
        </div>
      </div>
      <div className="w-100 text-center mt-2">
        <button className="btn btn-link" onClick={handleLogout}>
          Log Out
        </button>
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