// Import the functions you need from the SDKs you need
import {
  hideLoginError,
  showLoginState,
  showLoginForm,
  showApp,
  showLoginError,
  btnLogin,
  btnSignup,
  btnLogout,
  txtEmail,
  txtPassword,
  lblAuthState
} from './ui'

import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  connectAuthEmulator, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APPID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENTID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Authenticator 
const auth = getAuth(app);
connectAuthEmulator(auth, "http://localhost:9099");

const loginEmailPassword =  async () => {
  const loginEmail = txtEmail.value;
  const loginPassword = txtPassword.value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
    console.log(userCredential.user);
  }
  catch(error) {
    console.log(error);
    showLoginError(error);
  }

  btnLogin.addEventListener("click", loginEmailPassword);

  const createAccount = async () => {
    const loginEmail = txtEmail.value;
    const loginPassword = txtPassword.value;

    try {
      const userCredential = await createAccount(auth, loginEmail, loginPassword);
      console.log(userCredential.user);
    }
    catch(error) {
      console.log(error);
      showLoginError(error);
    }
  }

  btnSignup.addEventListener("click", createAccount);

  const monintorAuthState = async () => {
    onAuthStateChanged(auth, user => {
      if (user) {
        console.log(user);
        showApp();
        showLoginState(user);
        hideLoginError();
      }
      else {
        showLoginForm();
        lblAuthState.innerHTML = "You're not logged in.";
      }
    });
  }

  monintorAuthState();

  const logout = async () => {
    await signOut(auth);
  }
  
  btnLogout.addEventListener("click", logout);
}
