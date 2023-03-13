import React from "react";
import { CardContent, CardMedia, Container, Grid, styled, Typography, Paper } from "@mui/material/";
import CssBaseline from '@mui/material/CssBaseline';

// // This page will introduce our web app and give an overview of the features. 
// // It will also contain buttons for login and signup page which will redirect the user.

const HeroContainer = styled(Container)(({ theme }) => ({
  backgroundImage: `url(${"https://www.newhomesource.com/learn/wp-content/uploads/2019/10/open-floor-plan.jpg.webp"})`,
  height: "calc(100vh - 64px)",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  position: "relative",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "#fff",
  fontSize: "4rem",
  [theme.breakpoints.down("sm")]: {
    height: "300px",
    fontSize: "3em",
  },
}));


function LandingPage() {  
  return (
    <>
      <HeroContainer component={Paper} elevation={16} mb="4" maxWidth="false">
        <Typography variant="h2" fontWeight='bold' component="h1">
          Welcome to Corkboard! 
          <Typography variant="h5" fontWeight='bold' >
            A new easy way to for roommates to manage their fridge space and share grocery lists!
          </Typography>
        </Typography>
      </HeroContainer>
      <CssBaseline/>
      <Container maxWidth="false" sx={{backgroundColor:'#DFE9EB' }}>
        <Grid container spacing={8} p={5} pt={11} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <CardMedia
              component="img"
              height="250"
              image="https://www.tastingtable.com/img/gallery/the-clever-way-grocery-stores-stock-products/l-intro-1660768883.jpg"
            />
            <CardContent component={Paper}  elevation={4}>
              <Typography variant="h5" fontWeight='bold' >
                Make Grocery Trips
              </Typography>
              <Typography variant="body2" pt={2} color="textSecondary" >
                Plan and arrange grocery trips with your roommates.
              </Typography>
              </CardContent>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <CardMedia
              component="img"
              height="250"
              image="https://media.angi.com/s3fs-public/man-unpacking-groceries-fridge.jpeg?impolicy=leadImage"
            />
            <CardContent component={Paper} elevation={4}>
              <Typography variant="h5"fontWeight='bold'>
                Manage Communal Fridge
              </Typography>
              <Typography variant="body2" pt={2} color="textSecondary" >
                Keep track of what's in your pantry and refrigerator. 
              </Typography>
            </CardContent>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <CardMedia
              component="img"
              height="250"
              image="https://media.istockphoto.com/id/1328458850/photo/woman-crossing-items-of-shopping-list.jpg?s=612x612&w=0&k=20&c=Y9ypkHh2lRkSckFh0OU5AhHAdZfsMJ0r-4UlFjnY-4M="
            />
            <CardContent component={Paper} elevation={4}>
              <Typography variant="h5" fontWeight='bold'>
                Grocery List
              </Typography>
              <Typography variant="body2" pt={2} color="textSecondary" >
                Easily create and share your grocery lists with your roommates. 
              </Typography>
            </CardContent>
          </Grid>
        </Grid>
      </Container>
      <Container maxWidth='false' sx={{ backgroundColor: '#DFE9EB' ,position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non enim praesent elementum facilisis leo vel. Risus at ultrices mi tempus imperdiet. Semper risus in hendrerit gravida rutrum quisque non tellus. Convallis convallis tellus id interdum velit laoreet id donec ultrices. Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra nibh cras. Metus vulputate eu scelerisque felis imperdiet proin fermentum leo. Mauris commodo quis imperdiet massa tincidunt. Cras tincidunt lobortis feugiat vivamus at augue. At augue eget arcu dictum varius duis at consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa sapien faucibus et molestie ac.
      </Container>
      
    </>
  );
}

export default LandingPage;
