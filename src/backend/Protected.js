import React from 'react'
import { Navigate } from 'react-router-dom'
import { UserAuth } from './authContext'

const Protected = ({ children }) => {
    const { currentUser } = UserAuth();
    if (!currentUser) {
        console.log('Protected page, Login to access all pages'); // for devs
        console.log(currentUser);
        return <Navigate to ='/Login' />
    } 
  return children;
}

export default Protected;