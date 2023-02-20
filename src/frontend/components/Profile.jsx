import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Card, Alert, Container } from 'react-bootstrap';
import { UserAuth } from '../../backend/auth_functions/authContext';
import { GroupClass } from '../../backend/custom_classes/groupClass';

const Profile = () => {
  const { currUser, userData, updateProfile, changePassword, 
          setOrUpdateDisplayName, setOrUpdateProfilePicture,
          reauthenticateUser 
        } = UserAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newDisplayName, setNewDisplayName] = useState('');
  const [newProfilePicture, setNewProfilePicture] = useState('');
  const [newGroupID, setNewGroupID] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError('');

      if (newPassword) {
        try {
          await reauthenticateUser(userData.email, currentPassword);
          await changePassword(newPassword);
          setNewPassword('');
          console.log('New password set:');
          navigate('/profile');
        } catch (error) {
          console.error(error);
          setError('Failed to update password');
        }
      }

      if (newDisplayName) {
        try {
          await setOrUpdateDisplayName(newDisplayName);
          setNewDisplayName('');
          console.log('New display name set:', userData.displayName);
          navigate('/profile');
        } catch (error) {
          console.error(error);
          setError('Failed to update display name');
        }
      }

      if (newProfilePicture) {
        try {
          await setOrUpdateProfilePicture(newProfilePicture);
          setNewProfilePicture('');
          navigate('/profile');
        } catch (error) {
          console.error(error);
          setError('Failed to update profile picture');
        }
      }

      if (newGroupID) {
        try {
          const group = new GroupClass(userData.groupID);
          await group.leaveGroup(currUser);
          await group.joinGroup(newGroupID);
          setNewGroupID('');
          navigate('/profile');
        } catch (error) {
          console.error(error);
          setError('Failed to update Group ID');
        }
      }

      navigate('/profile');
    } catch (error) {
      setError('Failed to update profile information');
    }

    setLoading(false);
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">Profile</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group id="displayName">
                <Form.Label>Display Name</Form.Label>
                <Form.Control onChange={(e) => setNewDisplayName(e.target.value)} type="text" defaultValue={userData.displayName}  />
              </Form.Group>
              <Form.Group id="profilePicture">
                <Form.Label>Profile Picture URL</Form.Label>
                <Form.Control onChange={(e) => setNewProfilePicture(e.target.value)} type="text" defaultValue={userData.photoURL}  />
              </Form.Group>
              <Form.Group id="Group">
                <Form.Label>Group</Form.Label>
                <Form.Control onChange={(e) => setNewGroupID(e.target.value)}  type="text" defaultValue={userData.groupID} />
              </Form.Group>
              <hr />
              <Form.Group id="email">
                <Form.Label>Current Email</Form.Label>
                <Form.Control type="email" defaultValue={userData.email} readOnly />
              </Form.Group>
              <Form.Group id="currentPassword">
                <Form.Label>Current Password</Form.Label>
                <Form.Control type="password" placeholder="Enter current password to update password" onChange={(e) => setCurrentPassword(e.target.value)} required />
              </Form.Group>
              <hr />
              <Form.Group id="password">
                <Form.Label>New Password</Form.Label>
                <Form.Control type="password" defaultValue={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              </Form.Group>
              <Button className="w-100" type="submit" disabled={loading}>Update Profile</Button>
            </Form>
          </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2">
          <Link to="/dashboard">Back to Dashboard</Link>
        </div>
      </div>
    </Container>
  );
};

export default Profile;