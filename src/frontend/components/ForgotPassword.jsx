import React, { useEffect, useState } from 'react';
import {Alert, Container, Button, TextField, Box, Grid, Typography} from '@mui/material';

import { Link, useNavigate } from 'react-router-dom'
import { UserAuth } from '../../backend/authContext';


const ForgotPassword =() => {
  const { currentUser, resetPassword } = UserAuth();
	const navigate = useNavigate(); 
  const [loading, setLoading] = useState(false);
  const [resetAlert, setResetAlert] = useState(false);
  
  useEffect(() => {
    if (currentUser != null) {
      navigate('/Fridge');
    } 
    console.log(currentUser)
  },[currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = data.get('email');
    await resetPassword(email);

    setResetAlert(true);
    // hide the alert after 10 seconds
    setTimeout(() => setResetAlert(false), 10000);
    // redirect to login page after 10 seconds
    setTimeout(() => navigate('/Login'), 10000);

    console.log(email);
  };


  return (
    <Container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Box maxWidth="50vw" sx={{ alignItems: 'center', justifyContent: 'center' }}>
      <Grid sx={{ mt: 4 }}>
        <Typography component="h1" fontSize="2.8em" fontWeight='600'>
          Forgot Password?
        </Typography>
      </Grid>
      <Container sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
        Enter the email you used to sign up and we'll send you instructions to reset your password!
      </Container>
      <Grid sx={{ mt: 4 }}>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1, fontSize: "1em", fontWeight: "bold" }}>
          Email
          <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Enter your email"
          name="email"
          autoComplete="email"
          autoFocus
          />
          <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 4 }}
          >
            Send Reset Instructions
          </Button>
          {resetAlert && (
              <Alert severity="success">Check your email for further instructions</Alert>
            )}
        </Box>
      </Grid>
    </Box>
    </Container>
  )
}

export default ForgotPassword
