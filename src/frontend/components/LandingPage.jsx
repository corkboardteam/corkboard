import React from "react";
import { CardContent, CardMedia, Container, Grid, styled, Typography, Paper } from "@mui/material/";
import CssBaseline from '@mui/material/CssBaseline';
import { pink } from '@mui/material/colors';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';
import KitchenIcon from '@mui/icons-material/Kitchen';
import ListAltIcon from '@mui/icons-material/ListAlt';

// // This page will introduce our web app and give an overview of the features. 
// // It will also contain buttons for login and signup page which will redirect the user.
function HomeIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </SvgIcon>
  );
}


const HeroContainer = styled(Container)(({ theme }) => ({
  // backgroundImage: `url(${"https://www.newhomesource.com/learn/wp-content/uploads/2019/10/open-floor-plan.jpg.webp"})`,
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
    {/* <Container sx={{ border: 1 }}> */}
    <Container>
        <HomeIcon sx={{ color: pink[500], fontSize: 40, marginLeft: '150px', marginTop: '100px', transform: `rotate(-25deg)` }} />
        <KitchenIcon color="primary" sx={{ fontSize: 40, position: 'absolute', right: '200px', marginTop: '90px', transform: `rotate(25deg)` }} />
    </Container>
      <HeroContainer component={Paper} elevation={0} mb="4" maxWidth="false">
        <Typography variant="h2" fontWeight='bold' component="h1" >
          Welcome to Corkboard! 
          <Typography variant="h5" >
            A new easy way to for roommates to manage their fridge space and share grocery lists!
          </Typography>
        </Typography>
      </HeroContainer>
      {/* <CssBaseline/> */}
    <Container sx={{display: 'flex',  justifyContent: "center",}}>
        <ListAltIcon color="success" sx={{ fontSize: 40, marginLeft: '-50px', marginTop: '50px', transform: `rotate(-25deg)` }} />
    </Container>
      <Container maxWidth="false" sx={{backgroundColor:'white' }}>
      <CardMedia
              component="img"
              // image="https://www.tastingtable.com/img/gallery/the-clever-way-grocery-stores-stock-products/l-intro-1660768883.jpg"
              image={require("../assets/Screenshot 2023-03-13 214332.png")}
              sx={{ border: 1,
                transform: `scale(0.75)`, }}
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
