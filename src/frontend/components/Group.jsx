import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserAuth } from '../../backend/authContext';
import { GroupClass, generateGroupUID } from '../../backend/custom_classes/groupClass';
import { Container } from '@mui/system';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


const Group = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  const [joinGroupID, setJoinGroupID] = useState('');
  const [groupName, setGroupName] = useState('');
  // const [groupDesc, setgroupDesc] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { currentUser, updateProfile } = UserAuth();

  useEffect(() => {
    if (currentUser.groupID != null) {
      navigate('/Fridge');
    }
    console.log(currentUser);
  }, [currentUser, navigate])

  const handleJoinGroup = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      console.log(currentUser)

      const group = new GroupClass(joinGroupID);
      await group.joinGroup(currentUser);
      await updateProfile({ groupID: joinGroupID });
      navigate('/Fridge');

    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {

      setLoading(true);
      setError('');
      const groupID = await generateGroupUID()
      console.log(groupID);
      const group = new GroupClass(groupID);
      await group.createGroup(currentUser, groupName);
      const groupData = await group.data();
      await updateProfile({ groupID: groupData.uid });
      navigate('/Fridge');

    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <Container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box maxWidth="50vw" sx={{ alignItems: 'center', justifyContent: 'center' }}>
        <Grid sx={{ mt: 4, mb: 4 }}>
          <Typography component="h1" fontSize="2.8em" fontWeight='600'>
            Join an existing group or create a new one
          </Typography>
        </Grid>
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="Join Group" {...a11yProps(0)} sx={{ fontWeight: 'bold' }} />
              <Tab label="Create Group" {...a11yProps(1)} sx={{ fontWeight: 'bold' }} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <form onSubmit={handleJoinGroup}>
              <div className="mb-3">
                <input type="text" className="form-control" id="groupID"
                  value={joinGroupID}
                  onChange={(e) => setJoinGroupID(e.target.value)}
                  placeholder="Enter Group ID"
                />
              </div>
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 4 }}
              >
                Join Group
              </Button>
            </form>
            <div className="alert alert-danger" role="alert">{error}</div>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <form onSubmit={handleCreateGroup}>
              <div className="mb-3">
                <label htmlFor="groupName" className="form-label">Enter a group name!</label><br />
                <input type="text" className="form-control" id="groupName"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Enter Group Name"
                />
              </div>
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 4 }}
              >
                Create Group
              </Button>
            </form>
          </TabPanel>
        </Box>
      </Box>
    </Container>

    // <div className="container">
    //   <h2>Join an existing group or create a new one</h2>
    //   <form onSubmit={handleJoinGroup}>
    //     <div className="mb-3">
    //       <label htmlFor="groupID" className="form-label">Group ID</label>
    //       <input type="text" className="form-control" id="groupID"
    //         value={joinGroupID}
    //         onChange={(e) => setJoinGroupID(e.target.value)}
    //         placeholder="Enter Group ID"
    //       />
    //     </div>
    //     <button className="btn btn-primary" type="submit" disabled={loading}>
    //       Join Group
    //     </button>
    //   </form>
    //   <hr />
    //   <form onSubmit={handleCreateGroup}>
    //     <div className="mb-3">
    //       <label htmlFor="groupName" className="form-label">Group Name</label>
    //       <input type="text" className="form-control" id="groupName"
    //         value={groupName}
    //         onChange={(e) => setGroupName(e.target.value)}
    //         placeholder="Enter Group Name"
    //       />
    //     </div>
    //     <button className="btn btn-primary" type="submit" disabled={loading}>
    //       Create Group
    //     </button>
    //   </form>
    //   <div className="alert alert-danger" role="alert">{error}</div>
    // </div>
  );
};

export default Group;
