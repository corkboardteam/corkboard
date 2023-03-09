import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { UserAuth } from "../../backend/authContext"

const Dashboard = () => {
  const { currentUser } = UserAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/Login');
    } 
    console.log(currentUser);
  }, [currentUser, navigate]);

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