import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../../backend/auth_functions/authContext';
import { GroupClass, generateUniqueID } from '../../backend/custom_classes/groupClass';

const Group = () => {
  const [groupID, setGroupID] = useState('');
  const [groupName, setGroupName] = useState('');
  const [groupDesc, setgroupDesc] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { currUser } = UserAuth();
  const currentUser = currUser;

  // // checks if user is already in group and prevents them from going back to group signup/join page
  // useEffect(() => {
  //   if (!(currentUser.groupID == null)) {
  //     navigate('/dashboard');
  //   }
  // }, [currentUser, navigate]);

  const handleJoinGroup = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');

      const group = new GroupClass(groupID, groupName, groupDesc);
      const success = await group.joinGroup(currentUser);
      if (success) {
        navigate('/dashboard');
      }

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
      const UID = generateUniqueID();
      const group = new GroupClass(UID, groupName, groupDesc);
      const success = await group.createGroup(currentUser);
      if (success) {
        navigate('/dashboard');
      }

    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="container">
        <h2>Join or Create a Group</h2>
        <form onSubmit={handleJoinGroup}>
          <div className="mb-3">
            <label htmlFor="groupID" className="form-label">Group ID</label>
            <input type="text" className="form-control" id="groupID"
              value={groupID}
              onChange={(e) => setGroupID(e.target.value)}
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
          <div className="mb-3">
            <label htmlFor="groupDesc" className="form-label">Group Description</label>
            <textarea className="form-control" id="groupDesc" rows="3"
              value={groupDesc}
              onChange={(e) => setgroupDesc(e.target.value)}
              placeholder="Enter Group Description"
            ></textarea>
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            Create Group
          </button>
        </form>
        <div className="alert alert-danger" role="alert">{error}</div>
    </div>
  );
};

export default Group;
