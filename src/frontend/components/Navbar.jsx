import { useState } from 'react';
import { cloneElement } from 'react';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import KitchenIcon from '@mui/icons-material/Kitchen';
import CssBaseline from '@mui/material/CssBaseline';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../../backend/authContext';


const pages = ['Fridge', 'GroceryList', 'Discussion', 'Calendar'];
const settings = ['Profile', 'Logout'];

const styles = {

  customButton: {
    width: '100px',
    height: 'fit-content',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
    '&:hover': {
      boxShadow: 'none',
    },
    padding: '5px 5px',
    marginLeft: '5px',
    fontWeight: 'bold',
    fontSize: '1rem',
    borderRadius: '50px'
  },
}

function ElevationScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}
const Navbar = (props) => {
  const { currentUser, logout } = UserAuth();
  const [anchorNav, setAnchorNav] = useState(null);
  const [anchorUser, setAnchorUser] = useState(null);
  const navigate = useNavigate();
  // const gradient = 'linear-gradient(30deg, #BBC4EB 60%, #DFE9EB 95%)'; 

  const handleOpenNavMenu = (e) => {
    setAnchorNav(e.currentTarget);
  };
  const handleOpenUserMenu = (e) => {
    setAnchorUser(e.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorUser(null);
  };

  async function handleLogout() {
    await logout();
    navigate('/Login');
  }


  return (
    <ElevationScroll {...props}>
      <AppBar position="sticky" elevation={0} sx={{ background: 'white', color: 'black' }}>
        <CssBaseline />
        <Toolbar>
          <KitchenIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={Link} to="/Fridge"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 'bold',
              fontSize: '1.6rem',
              letterSpacing: '.2rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Corkboard
          </Typography>
          {currentUser && (
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {currentUser && pages.map((page) => (
                  <MenuItem key={page} onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">
                      <Link style={{ textDecoration: "none", color: "black" }} to={page}>
                        {page}
                      </Link>
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}
          <KitchenIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component={Link} to="/Fridge"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontWeight: 'bold',
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Corkboard
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end', ml: 2 }}>
            {currentUser && pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, mr: 4, px: 3, fontSize: '1rem', color: 'black', display: 'block' }}
              >
                <Link style={{ textDecoration: "none", color: "black" }} to={page}>
                  {page}
                </Link>

              </Button>
            ))}
          </Box>
          {currentUser ? (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 2 }}>
                  <Avatar alt="User Profile" src={currentUser.photoURL} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">
                      {setting === "Logout" ? (
                        <Link style={{ textDecoration: "none", color: "black" }} onClick={handleLogout}>
                          {setting}
                        </Link>
                      ) : (
                        <Link style={{ textDecoration: "none", color: "black" }} to={setting}>
                          {setting}
                        </Link>
                      )}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>) : (
            <Box sx={{ flexGrow: 0 }}>
              <Button component={Link} to="/Login" color="inherit" sx={{ ...styles.customButton }}>
                Log in
              </Button>
              <Button variant="contained" component={Link} to="/Signup" color="primary" sx={{ ...styles.customButton }}>
                Sign up
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </ElevationScroll>
  );
}
export default Navbar;

