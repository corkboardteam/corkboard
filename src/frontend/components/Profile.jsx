import React, { useState, useEffect } from 'react';
import { Paper, Box, Alert, Container, Grid, TextField, Button, 
  Typography, Avatar, Divider, styled, Tab, Tabs, Table, TableContainer,
  TableBody, TableHead, TableRow, TableCell,} from '@mui/material/';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../../backend/authContext';
import { GroupClass } from '../../backend/custom_classes/groupClass';

const RootContainer = styled(Container)({
  marginTop: '64px',
  marginBottom: '32px',
});

const AvatarImage = styled(Avatar)({
  width: '120px',
  height: '120px',
  marginRight: '32px',
});

const FormContainer = styled(Grid)({
  marginTop: '32px',
});

const DividerContainer = styled(Divider)({
  margin: '32px 0',
});

function Profile() {
  const { currentUser, changePassword, changeEmail, updateProfile, 
          updateDisplayName, updateProfilePicture, updatePhoneNumber } = UserAuth();
  const navigate = useNavigate();
  const [newDisplayName, setNewDisplayName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhotoURL, setNewPhotoURL] = useState('');
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [updateAlert, setUpdateAlert] = useState(false);
  const [passwordAlert, setPasswordAlert] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [password, setPassword] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [members, setMembers] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [userInGroup, setUserInGroup] = useState('');

  

  useEffect(() => {
    console.log(currentUser);
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const name = data.get('name');
    const email = data.get('email');
    const phone = data.get('phone');
    const photoURL = data.get('photo');
    const password = data.get('password');

    if (name !== currentUser.displayName) {
      handleDisplayName(newDisplayName);
      setUpdateAlert(true);
    }
    if (email !== currentUser.email) {
      handleEmail(newEmail, password);
      setUpdateAlert(true);
    }
 
    if (phone !== currentUser.phoneNumber) {
      handlePhoneNumber(newPhoneNumber);
      setUpdateAlert(true);
    }

    if (photoURL != currentUser.photoURL) {
      handlePhotoURL(photoURL);
      setUpdateAlert(true);
    }

    navigate('/Profile');
    setTimeout(() => setUpdateAlert(false), 5000);   

  }

  const handleDisplayName = async (name) => {
    console.log(name);
    await updateDisplayName(name);
    return;
    };
    
  const handleEmail = async (email,password) => {
    console.log(email);
    await changeEmail(email, password);
    return;

      
  };
  const handlePhoneNumber = async (phoneNumber) => {
    console.log(phoneNumber);
    // remove dashes from phone number
    phoneNumber = phoneNumber.replace(/-/g, '');
    await updatePhoneNumber(phoneNumber);
    return;  
  };


  const handlePhotoURL = async (photoURL) => {
    console.log(photoURL);
    await updateProfilePicture(photoURL);
    return;
  };

  
  const handlePassword = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const currPassword = data.get('currentPassword');
    const newPassword = data.get('newPassword');
    await changePassword(newPassword, currPassword);
    setPasswordAlert(true);
    setTimeout(() => setUpdateAlert(false), 5000); 
    navigate('/Profile');
  };
  
  const handleTabChange = async (event, newValue) => {
    if (newValue === 2) {
      if (currentUser.groupID) {
        setUserInGroup(true);
        const group = new GroupClass(currentUser.groupID);
        const data = await group.data();
        const name = data.name;
        const members = data.members;
        console.log(data);
        setGroupName(name);
        console.log(groupName);
        setMembers(members);
        console.log(members);
      } else {
        setUserInGroup(false);
      }
      

    }
    setSelectedTab(newValue);
  };

  const handleLeaveGroup = async () => {
    const group = new GroupClass(currentUser.groupID);
    await group.leaveGroup(currentUser);
    await updateProfile({ groupID: null });
    navigate('/Profile');
  };

  return (
    <Grid sx={{ display: 'flex', flexDirection: 'row', alignItems: 'stretch', backgroundColor: '#DFE9EB', minHeight: '100vh' }}>
      <Grid component={Paper} elevation={4} item xs={5} width='400px' sm={10} mt={10} ml={20} mb={10} >
        <Tabs orientation="vertical" variant='fullWidth' value={selectedTab} onChange={handleTabChange}>
          <Tab label="Profile" />
          <Tab label="Change Password" />
          <Tab label="Group" />
        </Tabs>
      </Grid>
      <Box component={Paper} elevation={4} sx={{ width: '100%', px: 2, mt: 10, mb: 10, mr: 20 }}>
        <Grid container sx={{ justifyContent: 'center' }}>
          <Grid item xs={12} sm={9} >
            {selectedTab === 0 && (
              <>
                <AvatarImage
                  src={currentUser.photoURL}
                  alt="User Profile"
                  sx={{ display: 'inside',mx: 'auto', mt: 2 }}
                />
                <Typography variant="h4" gutterBottom sx={{textAlign: 'center', fontWeight: 'bold'}} >
                  Profile
                </Typography>
                <DividerContainer />
                <FormContainer container>
                  <Grid component="form" onSubmit={handleSubmit} item xs={12}>
                    <Grid mb={1}>
                      Display Name
                      <TextField
                        label="Display Name"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        name="name"
                        onChange={(e) => setNewDisplayName(e.target.value)}
                        defaultValue={newDisplayName || currentUser.displayName}
                      />
                    </Grid>
                    <Grid mb={1}>
                      Email
                      <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        defaultValue={newEmail || currentUser.email}
                        onChange={(e) => setNewEmail(e.target.value)}
                        name="email"
                      />
                      {editingEmail && (
                        <TextField
                          label="Enter password to change email"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                          type="password"
                          name="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      )}
                      <Grid container justify="flex-end" mb={1}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => setEditingEmail(!editingEmail)}
                        >
                          {editingEmail ? 'Cancel' : 'Edit Email'}
                        </Button>
                      </Grid>
                    </Grid>
                    Group ID
                    <Grid mb={1}>
                      <TextField
                        label="Group"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        defaultValue={currentUser.groupID}
                        name="group"
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </Grid>
                    Phone Number
                    <Grid mb={1}>
                      <TextField
                        label="Phone Number"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        defaultValue={newPhoneNumber || currentUser.phoneNumber}
                        onChange={(e) => setNewPhoneNumber(e.target.value)}
                        name="phone"
                      />
                    </Grid>
                    Profile Picture URL
                    <Grid mb={1}>
                      <TextField
                        label="Profile Picture URL"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={newPhotoURL || currentUser.photoURL}
                        onChange={(e) => setNewPhotoURL(e.target.value)}
                        name="photo"
                      />
                    </Grid>
                    <Grid mb={1}>
                      <Button variant="contained" color="primary" type="submit">
                        Submit
                      </Button>
                      {updateAlert && (
                        <Alert severity="success">Profile updated successfully!</Alert>
                      )}
                    </Grid>
                  </Grid>
                </FormContainer>
                <DividerContainer />
              </>
            )}
            {selectedTab === 1 && (
              <>
              <FormContainer container>
                <Grid component="form" onSubmit={handlePassword} item xs={12}>
                  <Typography variant="h5" gutterBottom sx={{textAlign: 'center', fontWeight: 'bold'}}>
                    Change Password
                  </Typography>
                  <DividerContainer />
                  <Grid mb={1}>
                    Current Password
                    <TextField
                      label="Current Password"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      type="password"
                      name="currentPassword"
                    />
                  </Grid>
                  <Grid mb={1}>
                    New Password
                    <TextField
                      label="New Password"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      type="password"
                      name="newPassword"
                    />
                  </Grid>
                  <Grid mb={1}>
                    Confirm New Password
                    <TextField
                      label="Confirm New Password"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      type="password"
                      name="confirmNewPassword"
                    />
                  </Grid>
                  <Grid mb={1}>
                    <Button variant="contained" color="primary" type="submit">
                      Change Password
                    </Button>
                    {passwordAlert && (
                      <Alert severity="success">Password updated successfully!</Alert>
                    )}
                  </Grid>
                </Grid>
              </FormContainer>
              <DividerContainer />
              </>
            )}
            {selectedTab === 2 && (
              <>
                {userInGroup ? (
                  <>
                    <Typography variant="h4" gutterBottom sx={{mt: 4, textAlign: 'center', fontWeight: 'bold'}}>
                      {groupName} ({currentUser.groupID})
                    </Typography>
                    <DividerContainer />
                    <TableContainer component={Paper}>
                      <Table sx={{ minWidth: 750 }}>
                        <TableHead>
                          <TableRow>
                            <TableCell>UID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {members.map((member) => (
                            <TableRow key={member.uid}>
                              <TableCell>{member.uid}</TableCell>
                              <TableCell>{member.name}</TableCell>
                              <TableCell>{member.email}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <Box sx={{display: 'flex', justifyContent: 'flex-end', mt: 2, mb: 2, mr: 2}}>
                      <Button variant="contained" color="secondary" onClick={handleLeaveGroup}>
                        Leave Group
                      </Button>
                    </Box>
                  </>
                ) : (
                  <Typography variant="h5" gutterBottom sx={{mt: 10, textAlign: 'center', fontWeight: 'bold'}}>
                    Not in a group yet? Join a group <Link to="/Group">here!</Link>  
                  </Typography>
                )}
                <DividerContainer />
              </>
            )}
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
}

export default Profile

