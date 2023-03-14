import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
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
    <Box sx={{ backgroundColor: '#f5f5f5',position: 'static', overflow: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CssBaseline />
      <Grid container component="main" sx={{ 
      mt: 4,
      mb: 10,
      px: 14,
      py: 8,
      justifyContent: 'center',
      fontFamily: 'Kaleko 205 Medium',
      color: 'inherit',
      textDecoration: 'none',}}>
       <Grid item xs={8} p={6} sm={16} md={5} component={Paper} elevation={8} square> 
        <Box
          sx={{
            my: 4,
            mx: 'auto',
            p: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h7" fontFamily='Kaleko 205 Medium' pb={3} fontWeight='bold'>
            Forgot Password?
          </Typography>

          <Typography component="h3" variant="body1" fontFamily='Kaleko 205 Medium'fontWeight='normal' >
            Enter the email you used to sign up and we'll send you instructions to reset your password!
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1, pt: 4, fontWeight: "bold" }}>
            Email Address
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
        </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default ForgotPassword
