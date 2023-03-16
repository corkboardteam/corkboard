import React, { useState, useEffect } from 'react';
import { Paper, Box, Alert, Grid, TextField, Button, 
  Typography, Avatar, Divider, styled, Tab, Tabs, Table, TableContainer,
  TableBody, TableHead, TableRow, TableCell,} from '@mui/material/';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../../backend/authContext';
import { GroupClass } from '../../backend/custom_classes/groupClass';
import User from '../../backend/custom_classes/user';

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
  const [newPhotoURL, setNewPhotoURL] = useState('');
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [updateAlert, setUpdateAlert] = useState(false);
  const [passwordAlert, setPasswordAlert] = useState(false);
  const [emailAlert, setEmailAlert] = useState(false);
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
    const phone = data.get('phone');
    const photoURL = data.get('photo');
  
    let updated = false;
  
    if (name && name !== currentUser.displayName) {
      handleDisplayName(name);
      updated = true;
    }
  
    if (phone && phone !== currentUser.phoneNumber) {
      handlePhoneNumber(phone);
      updated = true;
    }
  
    if (photoURL && photoURL !== currentUser.photoURL) {
      handlePhotoURL(photoURL);
      updated = true;
    }
  
    if (updated) {
      setUpdateAlert(true);
      setTimeout(() => setUpdateAlert(false), 5000);
    }
  
    navigate('/Profile');
  }

  const handleDisplayName = async (name) => {
    console.log(name);    
    const updatedUserData = {};
    updatedUserData.name = name;
    const group = new GroupClass(currentUser.groupID);
    group.updateMember(currentUser, updatedUserData);
    await updateDisplayName(name);
    return;
    };
  
  const handleEmail = async (e) => {
    e.preventDefault();
    const updatedUserData = {};
    const data = new FormData(e.target);
    const email = data.get('newemail');
    const password = data.get('curpassword');

    await changeEmail(email, password);

    updatedUserData.email = email;
    const group = new GroupClass(currentUser.groupID);
    group.updateMember(currentUser, updatedUserData);

    setEmailAlert(true);
    setTimeout(() => setEmailAlert(false), 5000);       
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
    setTimeout(() => setPasswordAlert(false), 5000); 
  };
  
  const handleLeaveGroup = async () => {
    const group = new GroupClass(currentUser.groupID);
    await group.leaveGroup(currentUser);
    await updateProfile({ groupID: null });
    setSelectedTab(0);
    navigate('/Profile');
  };

  const handleTabChange = async (event, newValue) => {
    if (newValue === 3) {
      if (currentUser.groupID) {
        setUserInGroup(true);
        const group = new GroupClass(currentUser.groupID);
        const data = await group.data();
        const name = data.name;
        // const members = data.members;
        const user = new User(currentUser)
        const userData = await user.data();
        const groupID = userData.groupID
        // gets group members with groupID
        const members = await user.getAllUsersWithGroupID(groupID);
        setGroupName(name);
        setMembers(members);
      } else {
        setUserInGroup(false);
      }
    }
    
    setSelectedTab(newValue);
  };

  

  return (
    <Grid sx={{ display: 'flex', flexDirection: 'row', alignItems: 'stretch', backgroundColor: '#DFE9EB', minHeight: '100vh' }}>
      <Grid component={Paper} elevation={4} item xs={5} width='400px' sm={10} mt={10} ml={20} mb={10} >
        <Tabs orientation="vertical" variant='fullWidth' value={selectedTab} onChange={handleTabChange}>
          <Tab label="Profile" />
          <Tab label="Change Email" />
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
                <DividerContainer />
                <FormContainer >
                  <Grid component="form" onSubmit={handleSubmit} mt={2} item xs={12}>
                    <Grid mb={1}>
                      Display Name
                      <TextField
                        placeholder='Enter a display name'
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
                        placeholder='Email'
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        defaultValue= { currentUser.email}
                        InputProps={{
                          readOnly: true,
                        }}
                        name="email"
                      />
                    </Grid>
                    Group ID
                    <Grid mb={1}>
                      <TextField
                        placeholder="Group ID"
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
                        placeholder='Enter your phone number'
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
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        defaultValue={newPhotoURL || currentUser.photoURL}
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
              <FormContainer>
                <Grid component="form" onSubmit={handleEmail} item xs={12}>
                  <Typography variant="h5" sx={{textAlign: 'center', fontWeight: 'bold'}}>
                    Change Email
                  </Typography>
                  <DividerContainer />
                  <Grid mb={1}>
                    Email
                    <TextField
                      required
                      label="Enter new email"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      type="email"
                      name="newemail"
                    />
                  </Grid>
                  <Grid mb={1}>
                    Password
                    <TextField
                      required
                      label="Enter password to change email"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      type="password"
                      name="curpassword"
                        />
                  </Grid>
                  <Grid mb={1}>
                    <Button variant="contained" color="primary" type="submit">
                      Change Email
                    </Button>
                    {emailAlert && (
                      <Alert severity="success">Email updated successfully!</Alert>
                    )}
                  </Grid>
                </Grid>
              </FormContainer>
              <DividerContainer />
              </>
            )}
            {selectedTab === 2 && (
              <>
              <FormContainer>
                <Grid component="form" onSubmit={handlePassword} item xs={12}>
                  <Typography variant="h5" gutterBottom sx={{textAlign: 'center', fontWeight: 'bold'}}>
                    Change Password
                  </Typography>
                  <DividerContainer />
                  <Grid mb={1}>
                    Current Password
                    <TextField
                      required
                      label="Enter current password"
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
                      required
                      label="Enter new password"
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
                      required
                      label="Reenter new password"
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
            {selectedTab === 3 && (
              <>
                {userInGroup ? (
                  <>
                    <Typography variant="h4"  sx={{mt: 4, textAlign: 'center', fontWeight: 'bold'}}>
                      {groupName} ({currentUser.groupID})
                    </Typography>
                    <DividerContainer />
                    <TableContainer >
                      <Table sx={{mt: 4, minWidth: 700 }}>
                        <TableHead>
                          <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email Address</TableCell>
                            <TableCell>Phone Number</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {members.map((member) => (
                            <TableRow key={member.uid}>
                              <TableCell>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                  <img src={member.photoURL} style={{ width: '35px', borderRadius: '50%', marginRight: '10px' }} />
                                  {member.displayName}
                                </div>
                              </TableCell>
                              <TableCell>{member.email}</TableCell>
                              <TableCell>{member.phoneNumber}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <Box onClick={handleLeaveGroup} sx={{display: 'flex', justifyContent: 'flex-end', mt: 2, mb: 2, mr: 2}}>
                      <Button variant="contained" color="primary" type="submit">
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

