import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../../backend/authContext';
import { db } from '../../backend/firebase'
import { doc, getDoc} from 'firebase/firestore'
import { GroupClass } from '../../backend/custom_classes/groupClass';

const Profile = () => {
  const { currentUser, changePassword, changeEmail, updateProfile, 
          updateDisplayName, updateProfilePicture, 
          linkPhone, updatePhone, verifyEmail 
        } = UserAuth();
  const [user, setUser] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [editingPassword, setEditingPassword] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState('');
  const [newPhotoURL, setNewPhotoURL] = useState('');
  const [newGroupID, setNewGroupID] = useState('');
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    setUser(currentUser);
    console.log(currentUser);
  }, [currentUser]);

  const handleDisplayName = async (e) => {
    e.preventDefault();
      try {
        setLoading(true);
        setError('');
        await updateDisplayName(newDisplayName);
        setNewDisplayName(newDisplayName);
        navigate('/profile');
     } catch (error) {
      setError('Failed to update display name');
     } 
    setLoading(false);
     
   };
    
  const handlePhotoURL = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await updateProfilePicture(newPhotoURL);
      setNewPhotoURL(newPhotoURL);
      navigate('/profile');

    } catch (error) {
      setError('Failed to update profile picture');
    }
    setLoading(false);
  };

  const handleGroup = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      if (!currentUser.groupID) {
        await handleJoinGroup();
      } 
      navigate('/profile');
    } catch (error) {
      setError('Failed to join group');
    }
    
    setLoading(false);
    
  };

  const handlePhoneNumber = async (e) => {
    e.preventDefault();
    try {
      // need to add buttons to link phone or update phone
      setLoading(true);
      setError('');
      if (currentUser.phoneNumber == null) {
        await handleLinkPhone();
      } else {
        await handleUpdatePhone();
      }
      navigate('/profile');
    } catch (error) {
      setError('Failed to update phone number');
    }
    setLoading(false);
    
  };

  const handleEmail = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await changeEmail(newEmail, currentPassword);
      navigate('/profile');
      setNewEmail(newEmail);
    } catch (error) {
      setError('Failed to update email');
    }
    
    setLoading(false);
    
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await changePassword(newPassword, currentPassword);
      setCurrentPassword('');
      setNewPassword('');
      setEditingPassword(false);
      navigate('/profile');
    } catch (error) {
      setError('Failed to update password');
    } 
    setLoading(false);
    
  };
  
  const handleLinkPhone = async () => {
    try {
      await linkPhone(newPhoneNumber, verificationCode);
      setNewPhoneNumber(newPhoneNumber);
      navigate('/');
    } catch (error) {
      setError('Failed to link phone number');
    };
  }

  const handleUpdatePhone = async () => {
    try {
      await updatePhone(newPhoneNumber, verificationCode);
      await updateProfile( { phoneNumber : newPhoneNumber} );
      setNewPhoneNumber(newPhoneNumber);
      navigate('/');
    } catch (error) {
      setError('Failed to link phone number');
    }
  };

  const handleJoinGroup = async () => {
    try {
      const groupRef = doc(db, "groups", newGroupID);
      const groupDoc = await getDoc(groupRef);
      if (!groupDoc.exists()) {
        setError('Group does not exist');
        return;
      }
      const group = new GroupClass(newGroupID);
      await group.joinGroup(currentUser);
      await updateProfile({ groupID: newGroupID });
      setNewGroupID(newGroupID);
      navigate('/profile');
      
    } catch (error) {
      setError('Failed to join group');
    }
  };

  const handleLeaveGroup = async () => {
    try {
      const group = new GroupClass(currentUser.groupID);
      await group.leaveGroup(currentUser);
      await updateProfile({ groupID: null });
      setNewGroupID('');
      navigate('/profile');
    } catch (error) {
      setError('Failed to leave group');
    }
  };
return (
  <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
    <div className="w-100" style={{ maxWidth: "700px" }}>
      <div className="card">
        <div className="card-body">
          <h2 className="text-center mb-4">Profile</h2>
          {error && <div className="alert alert-danger">{error}</div>}
            <div className="mb-3" id="displayName">
              <label className="form-label">Display Name</label>
              <form onSubmit={handleDisplayName}>
                <div className="input-group">
                  <input className="form-control" defaultValue={newDisplayName || currentUser.displayName} onChange={(e) => setNewDisplayName(e.target.value)} type="text" />
                  <button type="submit" className="btn btn-outline-secondary" disabled={loading}>{loading ? 'Updating...' : 'Edit'}</button>
                </div>
              </form>
            </div>
            <div className="mb-3" id="email">
              <label className="form-label">Email</label>
              <form onSubmit={handleEmail}>
                <div className="input-group">
                  <input className="form-control" defaultValue={newEmail || currentUser.email} onChange={(e) => setNewEmail(e.target.value)} type="text" />
                  <button type="submit" className="btn btn-outline-secondary"disabled={loading}>{loading ? 'Updating...' : 'Edit'} </button>
                </div>
              </form>
            </div>
            <div className="mb-3" id="profilePicture">
              <label className="form-label">Profile Picture URL</label>
              <form onSubmit={handlePhotoURL}>
                <div className="input-group">
                  <input className="form-control" defaultValue={newPhotoURL || currentUser.photoURL} onChange={(e) => setNewPhotoURL(e.target.value)} type="text" />
                  <button type="submit" className="btn btn-outline-secondary" disabled={loading}>{loading ? 'Updating...' : 'Edit'}</button>
                </div>
              </form>
            </div>
            <div className="mb-3" id="Group">
              <label className="form-label">Group</label>
              <form onSubmit={handleGroup}>
                <div className="input-group">
                  <input className="form-control" defaultValue={newGroupID || currentUser.groupID} onChange={(e) => setNewGroupID(e.target.value)} type="text" />
                  {currentUser.groupID ? (
                    <button className="btn btn-secondary ms-1" type="submit" onClick={handleLeaveGroup}disabled={loading}>{loading ? 'Leaving...' : 'Leave Group'}</button>
                  ) : (
                    <button className="btn btn-primary ms-1" type="submit" onClick={handleJoinGroup} disabled={loading}>{loading ? 'Joining...' : 'Join Group'}</button>
                  )}
                </div>
              </form>
            </div>
            <div className="mb-3" id="newPhoneNumber">
              <label className="form-label">Phone Number</label>
              <form onClick={handlePhoneNumber}>
                <div className="input-group">
                  <input className="form-control" defaultValue={newPhoneNumber || currentUser.phoneNumber} onChange={(e) => setNewPhoneNumber(e.target.value)} type="text" />
                  {currentUser.newPhoneNumber ? (
                    <button className="btn btn-secondary ms-1" type="submit" onClick={handleLinkPhone} disabled={loading}>{loading ? 'Linking...' : 'Link Phone'}</button>
                  ) : (
                    <button className="btn btn-primary ms-1" type="submit" onClick={handleUpdatePhone} disabled={loading}>{loading ? 'Updating...' : 'Update Phone'}</button>
                  )}
                </div>
              </form>
            </div>
            <div className="mb-3" id="password">
              <label className="form-label">Current Password</label>
              <form onSubmit={handlePassword}>
                <div className="input-group">
                  <input className="form-control" type={editingPassword ? "password" : "text"} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}/>
                  {editingPassword && (<input className="form-control" type="password" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/>)}
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setEditingPassword(!editingPassword)} disabled={loading}>
                    {editingPassword ? "Cancel" : "Edit"}
                  </button>{editingPassword && (<button type="submit" className="btn btn-primary" disabled={loading}> {loading ? "Updating..." : "Update"} </button>)}
                </div>
              </form>
            </div>
        </div>
          <div className="w-100 text-center mt-2">
            <Link to="/dashboard">Back to Dashboard</Link>
          </div>
      </div>
    </div>
  </div>
            
        
  );
}

export default Profile; 