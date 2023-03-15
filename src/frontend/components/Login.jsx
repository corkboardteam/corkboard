import React, { useEffect } from 'react';
import { Button, CssBaseline, TextField, FormControlLabel, Checkbox, Paper, Box, Grid, Typography } from '@mui/material';
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
    <Box sx={{ backgroundColor: '#DFE9EB',position: 'relative', overflow: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Grid container component="main" sx={{ 
      mr: 2,
      mt: 4,
      mb: 12,
      px: 14,
      py: 8,
      fontFamily: 'Kaleko 205 Medium',
      color: 'inherit',
      textDecoration: 'none',}}>
        <CssBaseline />
        <Grid item xs={8} p={4} sm={16} md={5} component={Paper} elevation={8} square>
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
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2, p: 1 }}>
              <GoogleButton onClick={handleGoogleLogin} />
            </Box>
            <Typography component="h1" variant="h6" fontFamily='Kaleko 205 Medium'fontWeight='normal'>
              or
            </Typography>
            <Box component="form" noValidate onSubmit={handleLogin} sx={{ mt: 1, fontWeight: "bold" }}>
              Email*
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
              Password*
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
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 4 }}
              >
                Log in
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link to="/ForgotPassword" href="#" variant="body2">
                    {"Forgot password?"}
                  </Link>
                </Grid>
                <Grid item>
                  Don't have an account? 
                  <Link to="/Signup" href="#" variant="body2">
                    {"Sign up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: 'url(https://media.angi.com/s3fs-public/open-fridge-fruit-vegetables.jpeg?impolicy=leadImage)',
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) =>
            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
          backgroundSize: '110% 100%',
          backgroundPosition: 'center',
        }}
      />
      </Grid>
    </Box>
  )
}

export default Login