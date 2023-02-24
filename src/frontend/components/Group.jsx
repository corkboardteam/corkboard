import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserAuth } from '../../backend/authContext';
import { GroupClass, generateGroupUID } from '../../backend/custom_classes/groupClass';

const Group = () => {
  const [joinGroupID, setJoinGroupID] = useState('');
  const [groupName, setGroupName] = useState('');
  // const [groupDesc, setgroupDesc] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { currentUser, updateProfile } = UserAuth();

  useEffect(() => {
    if (currentUser.groupID != null) {
        navigate('/dashboard');
    }
    console.log(currentUser);
  },[currentUser, navigate])

  const handleJoinGroup = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');

      const group = new GroupClass(joinGroupID);
      await group.joinGroup(currentUser);
      await updateProfile({ groupID: joinGroupID });
      navigate('/dashboard');

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
      console.log('in handleCreateGroup');
      await group.createGroup(currentUser, groupName);
      const groupData = await group.data();
      await updateProfile({ groupID: groupData.uid });
      navigate('/dashboard');

    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="container">
        <h2>Join an existing group or create a new one</h2>
        <form onSubmit={handleJoinGroup}>
          <div className="mb-3">
            <label htmlFor="groupID" className="form-label">Group ID</label>
            <input type="text" className="form-control" id="groupID"
              value={joinGroupID}
              onChange={(e) => setJoinGroupID(e.target.value)}
              placeholder="Enter Group ID"
            />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            Join Group
          </button>
        </form>
        <hr />
        <form onSubmit={handleCreateGroup}>
          <div className="mb-3">
            <label htmlFor="groupName" className="form-label">Group Name</label>
            <input type="text" className="form-control" id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter Group Name"
            />
          </div>
          {/* <div className="mb-3">
            <label htmlFor="groupDesc" className="form-label">Group Description</label>
            <textarea className="form-control" id="groupDesc" rows="3"
              value={groupDesc}
              onChange={(e) => setgroupDesc(e.target.value)}
              placeholder="Enter Group Description"
            ></textarea>
          </div> */}
          <button className="btn btn-primary" type="submit" disabled={loading}>
            Create Group
          </button>
        </form>
        <div className="alert alert-danger" role="alert">{error}</div>
        <div className="w-100 text-center mt-2">
        Join or create a group later? <Link to="/dashboard">Dashboard</Link>
      </div>
    </div>
  );
};

export default Group;
