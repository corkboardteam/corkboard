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
  

  const signUp = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
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
    return updatePassword(auth.currentUser, password);
  }

  const updateProfile = async (data) => {
    try {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userDocRef, data);
      setCurrUser({ ...auth.currentUser, ...data });
      setUserData({ ...userData, ...data });
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

  const reauthenticateUser = async (email, password) => {
    try {
      const creds = EmailAuthProvider.credential(email, password);
      await reauthenticateWithCredential(auth.currentUser, creds);
    } catch (error) {
      console.error('Error reauthenticating user: ', error);
      throw error;
    }
  }
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth,async (user) => {
      setCurrUser(user);
      setLoading(false);
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          const { displayName, photoURL } = user;
          const userData = { displayName, photoURL };
          await setDoc(userDocRef, userData);
          setUserData(userData);
        }
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

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