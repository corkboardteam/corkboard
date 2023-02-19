import { useState, useContext } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getDoc, setDoc, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../backend/firebase';
import { UserAuth } from '../../backend/auth_functions/authContext';

const Group = () => {
  const [groupID, setGroupID] = useState('');
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { currUser } = UserAuth();
  const currentUser = currUser;

  const handleJoinGroup = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError('');

      const groupRef = doc(db, 'groups', groupID);
      const groupDoc = await getDoc(groupRef);

      if (!groupDoc.exists) {
        throw new Error('Group does not exist');
      }
      const groupData = groupDoc.data()
      await updateDoc(groupRef)({
        members: [...groupDoc.data().members, currentUser.uid],
      });
      console.log('Joined group:');
      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
      console.log("Group doesn't exist");
    }

    setLoading(false);
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();

    console.log(groupName)

    try {
      setLoading(true);
      setError('');
      const groupRef = doc(db, 'groups', groupID);

      const groupData = {
        name: groupName,
        description: groupDescription,
        members: [currentUser.uid],
        groupUID: groupID
      };

      await setDoc(groupRef, groupData);
      console.log("Group created:", groupData.name);
      navigate('/dashboard');
    } catch (error) {
      console.log(error)
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
            value={groupDescription}
            onChange={(e) => setGroupDescription(e.target.value)}
            placeholder="Enter Group Description"
          />
          <Form.Group className="mb-3">
            <Form.Label>Group UID</Form.Label>
            <Form.Control
              type="text"
              value={groupID}
              onChange={(e) => setGroupID(e.target.value)}
              placeholder="Create Group Unique ID"
            />
          </Form.Group>
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
