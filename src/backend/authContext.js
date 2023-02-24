import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, updatePassword, onAuthStateChanged, sendPasswordResetEmail,
  reauthenticateWithCredential, EmailAuthProvider, GoogleAuthProvider,
  updateEmail, signInWithPopup, sendEmailVerification, linkWithCredential,
  updatePhoneNumber, RecaptchaVerifier, PhoneAuthProvider
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoading(false);
      if (user) {
        console.log("user in use effect:")
        console.log(user)
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setCurrentUser(userDoc.data());
        } else {

          const { displayName, photoURL } = user;
          const currentUser = { displayName, photoURL };
          console.log("trouble")
          await setDoc(userRef, currentUser);
          setCurrentUser(currentUser);
        }
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const signUp = async (email, password) => {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCred.user;
      console.log("user: here")
      console.log(user.uid)
      const userData = {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        uid: user.uid,
        phoneNumber: null,
        groupID: null
      };

      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        console.log("exists")
        setDoc(userRef, userData);
        setCurrentUser(userData);
        console.log(userData)
      }
      console.log('Signed up successfully');

    } catch (error) {
      console.error('Error signing up', error);
      throw error;
    }


  };

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user
      const userRef = doc(db, 'users', user.uid);

      const docSnap = await getDoc(userRef)
      const userData = {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        uid: user.uid,
        groupID: docSnap.data().groupID
      };
      console.log('User logged in');
      setDoc(userRef, userData);
      setCurrentUser(userData);

    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  };

  const googleLogin = async () => {

    try {
      const provider = new GoogleAuthProvider();
      const userCred = await signInWithPopup(auth, provider);
      const user = userCred.user;
      const userData = {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        uid: user.uid,
        groupID: null
      };
      const userRef = doc(db, 'users', user.uid);
      setDoc(userRef, userData);
      setCurrentUser(userData);
      console.log('User logged in with Google');


    } catch (error) {
      console.error('Error logging in with Google', error);
      throw error;
    }

  };

  const logout = async () => {
    try {
      await signOut(auth);
      console.log('Logged out successfully');

    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  };
  const linkPhone = async (phoneNumber, verificationCode) => {
    try {
      const user = auth.currentUser;
      const applicationVerifier = new RecaptchaVerifier('recaptcha-container');
      const provider = new PhoneAuthProvider(auth);
      const verificationId = await provider.verifyPhoneNumber(phoneNumber, applicationVerifier);
      const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
      await linkWithCredential(user, credential);
      console.log('Phone number linked successfully');

    } catch (error) {
      console.error('Error linking phone number', error);
      throw error;
    }
  };

  const updatePhone = async (phoneNumber, verificationCode) => {
    try {
      const user = auth.currentUser;
      const applicationVerifier = new RecaptchaVerifier('recaptcha-container');
      const provider = new PhoneAuthProvider(auth);
      const verificationId = await provider.verifyPhoneNumber(phoneNumber, applicationVerifier);
      const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
      await updatePhoneNumber(user, credential);
      console.log('Phone number updated successfully');

    } catch (error) {
      console.error('Error updating phone number', error);
      throw error;
    }
  };

  const verifyEmail = async (email) => {
    try {
      const user = auth.currentUser;
      await sendEmailVerification(user);
      console.log('Verification email sent successfully');
    } catch (error) {
      console.error('Error verifying email:', error);
      throw error;
    }
    return
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      console.log('password reset email sent');

    } catch (error) {
      console.error('Error logging out:', error);
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
      throw error;
    }
  }
  const changePassword = async (newPassword, currPassword) => {
    try {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, currPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      console.log('Password updated successfully');

    } catch (error) {
      console.error('Error updating password:', error);
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
      throw error;
    }
  };

  const updateDisplayName = async (displayName) => {
    try {
      await updateProfile({ displayName });
      console.log('Updated display name');
    } catch (error) {
      console.error('Error setting display name:', error);
      throw error;
    }
  }

  const updateProfilePicture = async (photoURL) => {
    try {
      await updateProfile({ photoURL });
      console.log('Updated profile picture');
    } catch (error) {
      console.error('Error setting profile picture:', error);
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
    updatePhone,
    updateProfile,
    verifyEmail,
    linkPhone,

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
