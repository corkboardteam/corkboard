import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, updatePassword, onAuthStateChanged, sendPasswordResetEmail,
  reauthenticateWithCredential, EmailAuthProvider, GoogleAuthProvider,
  updateEmail, signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import User from './custom_classes/user';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const currUser = new User(user);
        const exists = await currUser.exists();
        if (exists) {
          const userData = await currUser.data();
          setCurrentUser(userData);
        }
      }
      setLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const signUp = async (email, password, name) => {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      userCred.user.displayName = name;
      userCred.user.trips = []
      const user = new User(userCred.user);
      const exists = await user.exists();
      if (!exists) {
        user.createUser();
        const userData = await user.data();
        setCurrentUser(userData);
        console.log(userData)
      }
      console.log('Signed up successfully');

    } catch (error) {
      console.error('Error signing up', error);
      alert(error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const user = new User(userCred.user);
      const userData = await user.data();
      setDoc(user.userRef, userData);
      setCurrentUser(userData);
      console.log('User logged in');

    } catch (error) {
      console.error('Error logging in:', error);
      alert(error);
      throw error;
    }
  };

  const googleLogin = async () => {

    try {
      const provider = new GoogleAuthProvider();
      const userCred = await signInWithPopup(auth, provider);
      const user = new User(userCred.user);
      const exists = await user.exists();
      if (!exists) {
        user.createUser();
        const userData = await user.data();
        setCurrentUser(userData);
      } else {
        const userData = await user.data();
        setDoc(user.userRef, userData);
        setCurrentUser(userData);
      } 
      console.log(currentUser)
      console.log('User logged in with Google');
    } catch (error) {
      console.error('Error logging in with Google', error);
      alert(error);
      throw error;
    }

  };

  const logout = async () => {
    try {
      await signOut(auth);
      console.log('Logged out successfully');

    } catch (error) {
      console.error('Error logging out:', error);
      alert(error);
      throw error;
    }
  };

  // const linkPhone = async (phoneNumber, verificationCode) => {
  //   try {
  //     const user = auth.currentUser;
  //     const applicationVerifier = new RecaptchaVerifier('recaptcha-container');
  //     const provider = new PhoneAuthProvider(auth);
  //     const verificationId = await provider.verifyPhoneNumber(phoneNumber, applicationVerifier);
  //     const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
  //     await linkWithCredential(user, credential);
  //     console.log('Phone number linked successfully');

  //   } catch (error) {
  //     console.error('Error linking phone number', error);
  //     throw error;
  //   }
  // };

  // const verifyEmail = async (email) => {
  //   try {
  //     const user = auth.currentUser;
  //     await sendEmailVerification(user);
  //     console.log('Verification email sent successfully');
  //   } catch (error) {
  //     console.error('Error verifying email:', error);
  //     throw error;
  //   }
  //   return 
  // };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      console.log('password reset email sent');

    } catch (error) {
      console.error('Error logging out:', error);
      alert(error);
      throw error;
    }
  };

  const changeEmail = async (newEmail, currPassword) => {
    try {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, currPassword);
      await reauthenticateWithCredential(user, credential);
      await updateEmail(user, newEmail);
      await updateProfile({ email: newEmail });
      console.log('Email updated successfully');

    } catch (error) {
      console.error('Error updating email:', error);
      alert(error);
      throw error;
    }
  }

  const changePassword = async (newPassword, currPassword) => {
    try {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, currPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

    } catch (error) {
      console.error('Error updating password:', error);
      alert(error);
      throw error;
    }
  }

  const updateProfile = async (data) => {
    try {
      const userRef = doc(db, 'users', currentUser.uid);

      const currentUserData = { ...currentUser };
      const updatedUserData = { ...currentUserData, ...data };

      await updateDoc(userRef, updatedUserData);
      setCurrentUser(updatedUserData);
      console.log('Updated Profile');

    } catch (error) {
      console.error('Error updating profile:', error);
      alert(error);
      throw error;
    }
  };

  const updatePhoneNumber = async (phoneNumber) => {
    try {
      const valid = isValidPhoneNumber(phoneNumber);
      if (valid) {
        const formattedNumber = formatPhoneNumber(phoneNumber);
        await updateProfile({ phoneNumber: formattedNumber });
        console.log('Phone number updated successfully');
      } else {
        alert('Enter a valid phone number')
        throw new Error('Not a valid phone number');
      }
    } catch (error) {
      console.error('Error updating phone number', error);
      alert(error);
      throw error;
    }
  };

  const updateDisplayName = async (displayName) => {
    try {
      await updateProfile({ displayName });
      console.log('Updated display name');
    } catch (error) {
      console.error('Error setting display name:', error);
      alert(error);
      throw error;
    }
  }

  const updateProfilePicture = async (photoURL) => {
    try {
      await updateProfile({ photoURL });
      console.log('Updated profile picture');
    } catch (error) {
      console.error('Error setting profile picture:', error);
      alert(error);
      throw error;
    }
  }

  const value = {
    currentUser,
    signUp,
    googleLogin,
    login,
    logout,
    resetPassword,
    changePassword,
    changeEmail,
    updateDisplayName,
    updateProfilePicture,
    updatePhoneNumber,
    updateProfile
  }
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};

function formatPhoneNumber(phoneNumber) {
  const areaCode = phoneNumber.slice(0, 3);
  const firstThree = phoneNumber.slice(3, 6);
  const lastFour = phoneNumber.slice(6);
  return `${areaCode}-${firstThree}-${lastFour}`;
}

function isValidPhoneNumber(phoneNumber) {
  const regex = /^[0-9]{10}$/;
  return regex.test(phoneNumber);
}