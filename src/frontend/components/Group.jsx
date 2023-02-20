import { useState, useContext, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
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

  // checks if user is already in group and prevents them from going back to group signup/join page
  useEffect(() => {
    if (!(currentUser.groupID == null)) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

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
    <div>
      <h2>Join or Create a Group</h2>
      <Form onSubmit={handleJoinGroup}>
        <Form.Group className="mb-3">
          <Form.Label>Group ID</Form.Label>
          <Form.Control
            type="text"
            value={groupID}
            onChange={(e) => setGroupID(e.target.value)}
            placeholder="Enter Group ID"
          />
        </Form.Group>
        <Button variant="primary" type="submit" disabled={loading}>
          Join Group
        </Button>
      </Form>
      <hr />
      <Form onSubmit={handleCreateGroup}>
        <Form.Group className="mb-3">
          <Form.Label>Group Name</Form.Label>
          <Form.Control
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Enter Group Name"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Group Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={groupDesc}
            onChange={(e) => setgroupDesc(e.target.value)}
            placeholder="Enter Group Description"
          />
        </Form.Group>
        <Button variant="primary" type="submit" disabled={loading}>
          Create Group
        </Button>
      </Form>
      {error && <Alert variant="danger">{error}</Alert>}
    </div>
  );
};

export default Group;
