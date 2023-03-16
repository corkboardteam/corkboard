import React, { useEffect } from 'react';
import { Container, Button, TextField, FormControlLabel, Checkbox, Box, Grid, Typography} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom'
import { GoogleButton } from 'react-google-button'
import { UserAuth } from '../../backend/authContext';

const Login =() => {
  const { currentUser, login, googleLogin } = UserAuth();
	const navigate = useNavigate();
  
  useEffect(() => {
    if (currentUser != null) {
      navigate('/Fridge');
    } 
    console.log(currentUser)
  },[currentUser, navigate]);


  const handleLogin = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = data.get('email');
    const password = data.get('password');
    await login(email, password);
    navigate('/Fridge');

    console.log(email, password);
    
  };

  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    await googleLogin();
  }

  return (
    <Container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Box maxWidth="50vw" sx={{ alignItems: 'center', justifyContent: 'center' }}>
      <Grid sx={{ mt: 4 }}>
        <Typography component="h1" fontSize="2.8em" fontWeight='600'>
        Log in
          </Typography>
      </Grid>
      <Container sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
        Don't have an account?
        <Box sx={{ marginLeft: '5px' }}>
        <Link to="/Signup" href="#" variant="body2">
          {"Sign up"}
        </Link>
        </Box>
      </Container>
      <Grid sx={{ mt: 4 }}>
        <Box component="form" noValidate onSubmit={handleLogin} sx={{ mt: 1, fontSize: "1em", fontWeight: "bold" }}>
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
          Password
          <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Create a password"
          type="password"
          id="password"
          autoComplete="current-password"
          />
          <Box sx={{ mt: 1, fontSize: "1em", fontWeight: "normal", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}> 
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Link to="/ForgotPassword" href="#" variant="body2">
              {"Forgot your password?"}
            </Link>
          </Box>
          <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 4 }}
          >
            Log in
          </Button>
        </Box>
        {/* <Box sx={{ display: "flex", justifyContent: "center"}}>
          <GoogleButton onClick={handleGoogleLogin} />
        </Box> */}
      </Grid>
    </Box>
    </Container>
  )
}

export default Login