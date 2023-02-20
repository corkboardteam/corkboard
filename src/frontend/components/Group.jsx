import { useState, useContext } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getDoc, setDoc, doc, updateDoc, arrayUnion, increment } from 'firebase/firestore'
import { db } from '../../backend/firebase';
import { UserAuth } from '../../backend/auth_functions/authContext';

const Group = () => {
  const [groupID, setGroupID] = useState('');
  const [createdGroupID, setCreatedGroupID] = useState('');
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
      const groupData = groupDoc.data()

      if (groupDoc.exists()) {
        if (groupData.members.includes(currentUser.uid)) {
          throw new Error('You are already a member of this group');
        }

        await updateDoc(groupRef, {
          members: arrayUnion(currentUser.uid),
          totalMembers: increment(1)
        });

        console.log('Joined group:', groupData);
        navigate('/dashboard');
      } else {
        throw new Error('Group does not exist');
      }
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();

    console.log(groupName)

    try {
      setLoading(true);
      setError('');
      const groupRef = doc(db, 'groups', createdGroupID);
      console.log('groupRef:', groupRef.path);
      const groupDoc = await getDoc(groupRef);
      console.log('groupDoc:', groupDoc.data());

      if (!(groupDoc.exists())) {
        const groupData = {
          name: groupName,
          description: groupDescription,
          members: arrayUnion(currentUser.uid),
          UID: createdGroupID,
          totalMembers: 1
        };
        await setDoc(groupRef, groupData);

        console.log("Group created:", groupData.name);
        navigate('/dashboard');

      } else {
        throw new Error('Group ID aleady exists');
      }
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
              value={createdGroupID}
              onChange={(e) => setCreatedGroupID(e.target.value)}
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
