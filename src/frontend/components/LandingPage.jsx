import React from "react";
import { CardContent, CardMedia, Container, Grid, styled, Typography, Paper } from "@mui/material/";
import CssBaseline from '@mui/material/CssBaseline';

// // This page will introduce our web app and give an overview of the features. 
// // It will also contain buttons for login and signup page which will redirect the user.

const HeroContainer = styled(Container)(({ theme }) => ({
  // backgroundImage: `url(${"https://www.newhomesource.com/learn/wp-content/uploads/2019/10/open-floor-plan.jpg.webp"})`,
  height: "calc(100vh - 64px)",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  position: "relative",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "black",
  fontSize: "4rem",
  [theme.breakpoints.down("sm")]: {
    height: "300px",
    fontSize: "3em",
  },
}));


function LandingPage() {  
  return (
    <>
      <HeroContainer component={Paper} elevation={0} mb="4" maxWidth="false">
        <Typography variant="h2" fontWeight='bold' component="h1" >
          Welcome to Corkboard! 
          <Typography variant="h5" >
            A new easy way to for roommates to manage their fridge space and share grocery lists!
          </Typography>
        </Typography>
      </HeroContainer>
      {/* <CssBaseline/> */}
      <Container maxWidth="false" sx={{backgroundColor:'white' }}>
      <CardMedia
              component="img"
              // image="https://www.tastingtable.com/img/gallery/the-clever-way-grocery-stores-stock-products/l-intro-1660768883.jpg"
              image={require("../assets/Screenshot 2023-03-13 214332.png")}
            />
        
      </Container>
      <Container maxWidth='false' sx={{ backgroundColor: 'white' ,position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      PLACEHOLDER
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non enim praesent elementum facilisis leo vel. Risus at ultrices mi tempus imperdiet. Semper risus in hendrerit gravida rutrum quisque non tellus. Convallis convallis tellus id interdum velit laoreet id donec ultrices. Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra nibh cras. Metus vulputate eu scelerisque felis imperdiet proin fermentum leo. Mauris commodo quis imperdiet massa tincidunt. Cras tincidunt lobortis feugiat vivamus at augue. At augue eget arcu dictum varius duis at consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa sapien faucibus et molestie ac.
      </Container>
      
    </>
  );
}

export default LandingPage;
