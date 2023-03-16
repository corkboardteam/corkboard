import React, { useEffect } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Link, useNavigate } from 'react-router-dom'
import { UserAuth } from '../../backend/authContext';
import { Container } from '@mui/system';


const Signup =() => {
  const { currentUser, signUp, updateDisplayName } = UserAuth();
	const navigate = useNavigate();
  
  useEffect(() => {
    if (currentUser != null) {
      navigate('/Fridge');
    } 
    console.log(currentUser);
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = data.get('email');
    const password = data.get('password');
    const name = data.get('name');
    await signUp(email, password, name);
    navigate('/Fridge');

    console.log(email, password);
  };

  return (
    <Container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Box maxWidth="50vw" sx={{ alignItems: 'center', justifyContent: 'center' }}>
      <Grid sx={{ mt: 4 }}>
        <Typography component="h1" fontSize="2.8em" fontWeight='600'>
          Sign up
          </Typography>
      </Grid>
      <Container sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
        Already have an account?
        <Box sx={{ marginLeft: '5px' }}>
          <Link to="/Login" href="#" variant="body2" >
            {"Log in"}
          </Link>
        </Box>
      </Container>
      <Grid sx={{ mt: 4 }}>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1, fontSize: "1em", fontWeight: "bold" }}>
          Name
          <TextField
          margin="normal"
          required
          fullWidth
          name="name"
          label="Enter your name"
          type="name"
          id="name"
          autoComplete="name"
          />
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
            Create Account
            </Button>
            </Box>
            </Grid>
            </Box>
            </Container>
    // <Box sx={{ backgroundColor: '#DFE9EB',position: 'static', overflow: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    //   <Grid container component="main" sx={{ 
    //   mr: 2,
    //   mt: 4,
    //   mb: 10,
    //   px: 14,
    //   py: 8,
    //   fontFamily: 'Kaleko 205 Medium',
    //   color: 'inherit',
    //   textDecoration: 'none',}}>
    //     <CssBaseline />
    //     <Grid item xs={8} p={4} sm={16} md={5} component={Paper} elevation={8} square>
    //       <Box
    //         sx={{
    //           my: 4,
    //           mx: 'auto',
    //           p: 1,
    //           display: 'flex',
    //           flexDirection: 'column',
    //           alignItems: 'center',
    //         }}
    //       >
    //         <Typography component="h1" variant="h4" fontFamily='Kaleko 205 Medium'fontWeight='600'>
    //           Sign up
    //         </Typography>
    //         <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1, fontWeight: "bold" }}>
    //           Name*
    //           <TextField
    //             margin="normal"
    //             required
    //             fullWidth
    //             name="name"
    //             label="Enter your name"
    //             type="name"
    //             id="name"
    //             autoComplete="name"
    //           />
    //           Email*
    //           <TextField
    //             margin="normal"
    //             required
    //             fullWidth
    //             id="email"
    //             label="Enter your email"
    //             name="email"
    //             autoComplete="email"
    //             autoFocus
    //           />
    //           Password*
    //           <TextField
    //             margin="normal"
    //             required
    //             fullWidth
    //             name="password"
    //             label="Create a password"
    //             type="password"
    //             id="password"
    //             autoComplete="current-password"
    //           />
    //           <FormControlLabel
    //             control={<Checkbox value="remember" color="primary" />}
    //             label="Remember me"
    //           />
    //           <Button
    //             type="submit"
    //             fullWidth
    //             variant="contained"
    //             sx={{ mt: 3, mb: 4 }}
    //           >
    //             Create Account
    //           </Button>
    //           <Grid container justifyContent='center' >
    //             <Grid item>
    //               Already have an account? 
    //               <Link to="/Login" href="#" variant="body2">
    //                 {"Log in"}
    //               </Link>
    //             </Grid>
    //           </Grid>
    //         </Box>
    //       </Box>
    //     </Grid>
    //   <Grid
    //     item
    //     xs={false}
    //     sm={4}
    //     md={7}
    //     sx={{
    //       backgroundImage: 'url(https://media.angi.com/s3fs-public/open-fridge-fruit-vegetables.jpeg?impolicy=leadImage)',
    //       backgroundRepeat: 'no-repeat',
    //       backgroundColor: (t) =>
    //         t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
    //       backgroundSize: '110% 100%',
    //       backgroundPosition: 'center',
    //     }}
    //   />
    //   </Grid>
    // </Box>
  )
}

export default Signup