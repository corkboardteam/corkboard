import React from "react";
import { CardContent, CardMedia, Container, Grid, styled, Typography, Paper } from "@mui/material/";
import CssBaseline from '@mui/material/CssBaseline';
import { pink, orange } from '@mui/material/colors';
import SvgIcon from '@mui/material/SvgIcon';
import KitchenIcon from '@mui/icons-material/Kitchen';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CreateIcon from '@mui/icons-material/Create';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import Box from '@mui/material/Box';

// // This page will introduce our web app and give an overview of the features. 
// // It will also contain buttons for login and signup page which will redirect the user.
function HomeIcon(props) {
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
        <CreateIcon sx={{ color: orange[500], fontSize: 40, marginLeft: '250px', marginBottom: '70px' }} />
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
      <Container sx={{ display: 'flex', justifyContent: "center", }}>
        <ListAltIcon color="success" sx={{ fontSize: 40, marginLeft: '-50px', marginTop: '50px', transform: `rotate(-25deg)` }} />
        <TaskAltIcon color="secondary" sx={{ fontSize: 40, marginLeft: '-150px', marginTop: '50px', transform: `rotate(-25deg)` }} />
      </Container>
      <Container maxWidth="false" sx={{ backgroundColor: 'white', marginBottom: '50px' }}>
        <CardMedia
          component="img"
          // image="https://www.tastingtable.com/img/gallery/the-clever-way-grocery-stores-stock-products/l-intro-1660768883.jpg"
          image={require("../assets/localhost_3000_Fridge.png")}
          sx={{
            border: 1,
            transform: `scale(0.75)`,
            boxShadow: 3
          }}
        />

      </Container>
      <Container sx={{ backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <Typography variant="h4" fontWeight='bold' component="h1" align='center'>
          Ever buy eggs at Costco on the same day that your roommate buys two cartons at Trader Joe’s?
        </Typography>
        <Box maxWidth='50vw' sx={{ backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <Typography variant="h4" component="h2" align='center' sx={{ marginTop: '50px', marginBottom: '20px' }}>
          Then Corkboard is for you and your roommates!
        </Typography>
        </Box>
        <CardMedia
          component="img"
          // image="https://www.tastingtable.com/img/gallery/the-clever-way-grocery-stores-stock-products/l-intro-1660768883.jpg"
          image={require("../assets/localhost_3000_Discussion.png")}
          sx={{
            border: 1,
            transform: `scale(0.75)`,
            boxShadow: 3
          }}
        />
      </Container>


    </>
  );
}

export default LandingPage;
