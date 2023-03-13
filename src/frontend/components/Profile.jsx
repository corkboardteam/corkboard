// import { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { UserAuth } from '../../backend/authContext';
// import { GroupClass } from '../../backend/custom_classes/groupClass';

// const Profile = () => {
//   const { currentUser, changePassword, changeEmail, updateProfile, 
//           updateDisplayName, updateProfilePicture, updatePhoneNumber 
//         } = UserAuth();
//   const [newEmail, setNewEmail] = useState('');
//   const [currentPassword, setCurrentPassword] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [editingPassword, setEditingPassword] = useState(false);
//   const [newDisplayName, setNewDisplayName] = useState('');
//   const [newPhotoURL, setNewPhotoURL] = useState('');
//   const [newGroupID, setNewGroupID] = useState('');
//   const [newPhoneNumber, setNewPhoneNumber] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
  
//   useEffect(() => {
//     console.log(currentUser);
//   }, [currentUser]);

//   const handleDisplayName = async (e) => {
//     e.preventDefault();
//       try {
//         setLoading(true);
//         setError('');
//         await updateDisplayName(newDisplayName);
//         setNewDisplayName(newDisplayName);
//         navigate('/Profile');
//      } catch (error) {
//       setError('Failed to update display name:', error);
//      } 
//     setLoading(false);
     
//    };
    
//   const handlePhotoURL = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       setError('');
//       await updateProfilePicture(newPhotoURL);
//       setNewPhotoURL(newPhotoURL);
//       navigate('/Profile');

//     } catch (error) {
//       setError('Failed to update profile picture:', error);
//     }
//     setLoading(false);
//   };

//   const handlePhoneNumber = async (e) => {
//     e.preventDefault();
//     try {
//       // need to add buttons to link phone or update phone
//       setLoading(true);
//       setError('');
//       await updatePhoneNumber(newPhoneNumber);
//       navigate('/Profile');
//     } catch (error) {
//       setError('Failed to update phone number:', error);
//     }
//     setLoading(false);
    
//   };

//   const handleEmail = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       setError('');
//       await changeEmail(newEmail, currentPassword);
//       navigate('/Profile');
//       setNewEmail(newEmail);
//     } catch (error) {
//       setError('Failed to update email:', error);
//     }
    
//     setLoading(false);
    
//   };

//   const handlePassword = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       setError('');
//       await changePassword(newPassword, currentPassword);
//       setCurrentPassword('');
//       setNewPassword('');
//       setEditingPassword(false);
//       navigate('/Profile');
//     } catch (error) {
//       setError('Failed to update password:', error);
//     } 
//     setLoading(false);
    
//   };
  

//   const handleJoinGroup = async () => {
//     try {
//       const group = new GroupClass(newGroupID);
//       const exists = await group.exists();
//       if (!exists) {
//         setError('Group does not exist');
//         return;
//       }
//       const data = await group.data();
//       const members = data.members;
//       if (members.includes(currentUser.uid)) {
//         setError('You are already a member of this group');
//         return;
//       }
//       await group.joinGroup(currentUser);
//       console.log('once');
//       await updateProfile({ groupID: newGroupID });
//       setNewGroupID('');
//       navigate('/Profile');
      
//     } catch (error) {
//       setError('Failed to join group:', error);
//     }
//   };

//   const handleLeaveGroup = async () => {
//     try {
//       const group = new GroupClass(currentUser.groupID);
//       await group.leaveGroup(currentUser);
//       await updateProfile({ groupID: null });
//       setNewGroupID('');
//       navigate('/Profile');
//     } catch (error) {
//       setError('Failed to leave group');
//     }
//   };
// return (
//   <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
//     <div className="w-100" style={{ maxWidth: "700px" }}>
//       <div className="card">
//         <div className="card-body">
//           <h2 className="text-center mb-4">Profile</h2>
//           {error && <div className="alert alert-danger">{error}</div>}
//             <div className="mb-3" id="displayName">
//               <label className="form-label">Display Name</label>
//               <form onSubmit={handleDisplayName}>
//                 <div className="input-group">
//                   <input className="form-control" defaultValue={newDisplayName || currentUser.displayName} onChange={(e) => setNewDisplayName(e.target.value)} type="text" />
//                   <button type="submit" className="btn btn-outline-secondary" disabled={loading}>{loading ? 'Updating...' : 'Edit'}</button>
//                 </div>
//               </form>
//             </div>
//             <div className="mb-3" id="email">
//               <label className="form-label">Email</label>
//               <form onSubmit={handleEmail}>
//                 <div className="input-group">
//                   <input className="form-control" defaultValue={newEmail || currentUser.email} onChange={(e) => setNewEmail(e.target.value)} type="text" />
//                   <button type="submit" className="btn btn-outline-secondary"disabled={loading}>{loading ? 'Updating...' : 'Edit'} </button>
//                 </div>
//               </form>
//             </div>
//             <div className="mb-3" id="profilePicture">
//               <label className="form-label">Profile Picture URL</label>
//               <form onSubmit={handlePhotoURL}>
//                 <div className="input-group">
//                   <input className="form-control" defaultValue={newPhotoURL || currentUser.photoURL} onChange={(e) => setNewPhotoURL(e.target.value)} type="text" />
//                   <button type="submit" className="btn btn-outline-secondary" disabled={loading}>{loading ? 'Updating...' : 'Edit'}</button>
//                 </div>
//               </form>
//             </div>
//             <div className="mb-3" id="Group">
//               <label className="form-label">Group</label>
//                 <div className="input-group">
//                   <input className="form-control" defaultValue={newGroupID || currentUser.groupID} onChange={(e) => setNewGroupID(e.target.value)} type="text" />
//                   {currentUser.groupID ? (
//                     <button className="btn btn-secondary ms-1" type="submit" onClick={handleLeaveGroup}disabled={loading}>{loading ? 'Leaving...' : 'Leave Group'}</button>
//                   ) : (
//                     <button className="btn btn-primary ms-1" type="submit" onClick={handleJoinGroup} disabled={loading}>{loading ? 'Joining...' : 'Join Group'}</button>
//                   )}
//                 </div>
//             </div>
//             <div className="mb-3" id="phoneNumber">
//               <label className="form-label">Phone Number</label>
//               <form onSubmit={handlePhoneNumber}>
//                 <div className="input-group">
//                   <input className="form-control" defaultValue={newPhoneNumber || currentUser.phoneNumber} onChange={(e) => setNewPhoneNumber(e.target.value)} type="text" />
//                   <button type="submit" className="btn btn-outline-secondary" disabled={loading}>{loading ? 'Updating...' : 'Edit'}</button>
//                 </div>
//               </form>
//             </div>
//             <div className="mb-3" id="password">
//               <label className="form-label">Current Password</label>
//               <form onSubmit={handlePassword}>
//                 <div className="input-group">
//                   <input className="form-control" type={editingPassword ? "password" : "text"} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}/>
//                   {editingPassword && (<input className="form-control" type="password" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/>)}
//                   <button type="button" className="btn btn-outline-secondary" onClick={() => setEditingPassword(!editingPassword)} disabled={loading}>
//                     {editingPassword ? "Cancel" : "Edit"}
//                   </button>{editingPassword && (<button type="submit" className="btn btn-primary" disabled={loading}> {loading ? "Updating..." : "Update"} </button>)}
//                 </div>
//               </form>
//             </div>
//         </div>
//           <div className="w-100 text-center mt-2">
//             <Link to="/Dashboard">Back to Dashboard</Link>
//           </div>
//       </div>
//     </div>
//   </div>
            
        
//   );
// }

// export default Profile; 

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

  const handleJoinGroup = async () => {
    navigate('/Group');
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
              <FormContainer container>
                <Grid component="form" onSubmit={handlePassword} item xs={12}>
                  <Typography variant="h5" gutterBottom>
                    Change Password
                  </Typography>
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
            )}
            {selectedTab === 2 && (
              <>
                {userInGroup ? (
                  <>
                    <Typography variant="h4" gutterBottom sx={{mt: 4, textAlign: 'center', fontWeight: 'bold'}}>
                      {groupName} Info ({currentUser.groupID})
                    </Typography>
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
              </>
            )}
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
}

export default Profile

