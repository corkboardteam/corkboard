import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { UserAuth } from "../../backend/authContext"

const Dashboard = () => {
  const [error, setError] = useState('');

  return (
  
    <div className="container">
      <div className="card">
        <div className="card-body">
          <h2 className="text-center mb-4">Dashboard</h2>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;