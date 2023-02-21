import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  const [newPhotoURL, setnewPhotoURL] = useState('');
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
          setNewDisplayName(newDisplayName);
          navigate('/profile');
        } catch (error) {
          console.error(error);
          setError('Failed to update display name');
        }
      }

      if (newPhotoURL) {
        try {
          await setOrUpdateProfilePicture(newPhotoURL);
          setnewPhotoURL(newPhotoURL);
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
          setNewGroupID(newGroupID);
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

    const newData = {
      displayName: newDisplayName,
      photoURL: newPhotoURL,
      groupID: newGroupID
    }
    await updateProfile(newData);
    navigate('/profile');
    setLoading(false);

    console.log('Updated profile info: ', newData);
  };

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <div className="card">
          <div className="card-body">
            <h2 className="text-center mb-4">Profile</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3" id="displayName">
                <label className="form-label">Display Name</label>
                <input className="form-control" onChange={(e) => setNewDisplayName(e.target.value)} type="text" defaultValue={userData.displayName}  />
              </div>
              <div className="mb-3" id="profilePicture">
                <label className="form-label">Profile Picture URL</label>
                <input className="form-control" onChange={(e) => setnewPhotoURL(e.target.value)} type="text" defaultValue={userData.photoURL}  />
              </div>
              <div className="mb-3" id="Group">
                <label className="form-label">Group</label>
                <input className="form-control" onChange={(e) => setNewGroupID(e.target.value)}  type="text" defaultValue={userData.groupID} />
              </div>
              <hr />
              <div className="mb-3" id="email">
                <label className="form-label">Current Email</label>
                <input className="form-control" type="email" defaultValue={userData.email} readOnly />
              </div>
              <div className="mb-3" id="currentPassword">
                <label className="form-label">Current Password</label>
                <input className="form-control" type="password" placeholder="Enter current password to update password" onChange={(e) => setCurrentPassword(e.target.value)} required />
              </div>
              <hr />
              <div className="mb-3" id="password">
                <label className="form-label">New Password</label>
                <input className="form-control" type="password" defaultValue={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              </div>
              <button className="btn btn-primary w-100" type="submit" disabled={loading}>Update Profile</button>
            </form>
          </div>
        </div>
        <div className="w-100 text-center mt-2">
          <Link to="/dashboard">Back to Dashboard</Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;