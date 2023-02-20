import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, updatePassword, onAuthStateChanged,
  sendPasswordResetEmail, reauthenticateWithCredential, EmailAuthProvider
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const UserContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currUser, setCurrUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});
  
useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth,async (user) => {
      setCurrUser(user);
      setLoading(false);
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          const { displayName, photoURL } = user;
          const userData = { displayName, photoURL };
          await setDoc(userRef, userData);
          setUserData(userData);
        }
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);
  
  const signUp = async (email, password) => {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCred.user;
    const userData = {
      email: email,
      displayName: null,
      profileURL: null,
      uid: user.uid,
      groupID: null
    };
    const userRef = doc(db, 'users', user.uid);
    setDoc(userRef, userData);
    setUserData(userData);
  };

   const login = (email, password) =>  {
    return signInWithEmailAndPassword(auth, email, password)
   };

  const logout = () => {
      return signOut(auth)
  };

  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };


  const changePassword = (password) => {
    const user = auth.currentUser;
    return updatePassword(user, password);
  }

  const updateProfile = async (data) => {
    try {
      const user = auth.currentUser;
      const userRef = doc(db, 'users', user.uid);
      
      const currentUserData = { ...userData };
      const updatedUserData = { ...currentUserData, ...data };
      
      setUserData(updatedUserData);
      setCurrUser((prevUser) => ({ ...prevUser, ...data }));
      await updateDoc(userRef, updatedUserData);
    } catch(error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const setOrUpdateDisplayName = async (displayName) => {
    try {
      await updateProfile({ displayName });
    } catch(error) {
      console.error('Error setting display name:', error);
      throw error;
    }
  }

  const setOrUpdateProfilePicture = async (photoURL) => {
    try {
      await updateProfile({ photoURL });
    } catch(error) {
      console.error('Error setting profile picture:', error);
      throw error;
    }
  }

  const setOrUpdateGroup = async (groupID) => {
    try {
      await updateProfile({ groupID });
    } catch (error) {
      console.error('Error setting group ID: ', error);
      throw error;
    }
  }

  const reauthenticateUser = async (email, password) => {
    try {
      const creds = EmailAuthProvider.credential(email, password);
      const user = auth.currentUser
      await reauthenticateWithCredential(user, creds);
    } catch (error) {
      console.error('Error reauthenticating user: ', error);
      throw error;
    }
  }
  

  const value = {
    signUp,
    currUser,
    userData,
    login,
    logout,
    resetPassword,
    changePassword,
    setOrUpdateDisplayName,
    setOrUpdateProfilePicture,
    setOrUpdateGroup,
    reauthenticateUser,
    updateProfile
  }
  return (
    <UserContext.Provider value = {value}>
      {!loading && children}
    </UserContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(UserContext);
};