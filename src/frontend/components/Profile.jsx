import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Card, Alert, Container } from 'react-bootstrap';
import { UserAuth } from '../../backend/auth_functions/authContext';

const Profile = () => {
  const { currUser, userData, updateProfile, changePassword, 
          setOrUpdateDisplayName, setOrUpdateProfilePicture,
          reauthenticateUser 
        } = UserAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newDisplayName, setNewDisplayName] = useState('');
  const [newProfilePicture, setNewProfilePicture] = useState('');
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
          setLoading(true);
          setError('');
          await reauthenticateUser(currUser.email, currentPassword);
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
          setLoading(true);
          setError('');
          await setOrUpdateDisplayName(newDisplayName);
          setNewDisplayName('');
          console.log('New display name set:', currUser.displayName);
          navigate('/profile');
        } catch (error) {
          console.error(error);
          setError('Failed to update display name');
        }
      }

      if (newProfilePicture) {
        try {
          setLoading(true);
          setError('');
          await setOrUpdateProfilePicture(newProfilePicture);
          setNewProfilePicture('');
          navigate('/profile');
        } catch (error) {
          console.error(error);
          setError('Failed to update profile picture');
        }
      }

      await updateProfile({
        displayName: newDisplayName,
        photoURL: newProfilePicture,
      });

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
                <Form.Control type="text" defaultValue={userData.displayName} onChange={(e) => setNewDisplayName(e.target.value)} />
              </Form.Group>
              <Form.Group id="profilePicture">
                <Form.Label>Profile Picture URL</Form.Label>
                <Form.Control type="text" defaultValue={userData.photoURL} onChange={(e) => setNewProfilePicture(e.target.value)} />
              </Form.Group>
              <hr />
              <Form.Group id="email">
                <Form.Label>Current Email</Form.Label>
                <Form.Control type="email" defaultValue={currUser.email} readOnly />
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