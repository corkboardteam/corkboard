import { auth } from './config.js';

const email = loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('login');
const signupBtn = document.getElementById('signup');
const loginErr = document.getElementById('login-err');
const loginErrMsg = document.getElementById('login-err-msg');
const appPage = document.getElementById('app');
const authState = document.getElementById('auth-state');
const logoutBtn = document.getElementById('logout');

export const showLoginForm = () => {
    loginForm.style.display = 'block';
    appPage.style.display = 'none';
}

export const showApp = () => {
    loginForm.style.display = 'none';
    appPage.style.display = 'block';
}

export const showLoginError = (error) => {
    loginErr.style.display = 'block';
    if (error.code == AuthErrorCodes.INVALID_PASSWORD) {
        loginErrMsg.innerHTML = 'Wrong password. Try again.';
    }
    else {
        loginErrMsg.innerHTML = 'Error: ${error.message}'; 
    }
}

export const hideLoginError = () => {
    loginErr.style.display = 'none';
    loginErrMsg.innerHTML = '';
}

// Create new user account with email and password
const createAccount = async () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  try {
    const userCreds = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCreds.user;
    console.log("New user account created with UID: ${user.uid}");
  }
  catch(error) {
    console.error('Error creating user account:', error);
    showLoginError(error);
  }
}

// login with email and password
const login = async () => {
  const loginEmail = emailInput.value;
  const loginPassword = passwordInput.value;

  try {
    const userCreds = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
    const user = userCreds.user;
    console.log("User logged in with UID: ${user.uid}");
  }
  catch(error) {
    console.error('Error logging in: ', error);
    showLoginError(error);
  }
}

// Log out
const logout = async () => {
  try {
    await signOut(auth);
    console.log("User logged out");
  }
  catch(error) {
    console.log("Error logging out", error);
    showLoginError(error);
  }
}

export const showLoginState = (user) => {
    authState.innerHTML = "You're logged in as ${user.displayName} (UID: ${user.uid}) (email: ${user.email})";
}

// Monitor authentication state
const monitorAuthState = async () => {
  onAuthStateChanged(auth, user => {
    if (user) {
      // User is logged in
      console.log('Logged in as ${user.displayName}')
      showApp();
      showLoginState(user);
      hideLoginError();
    } else {
      // User is logged out
      showLoginForm();
      authState.innerHTML = "You're not logged in.";
    }
  });
}

monitorAuthState();

signupBtn.addEventListener('click', createAccount);
loginBtn.addEventListener('click', login);
logoutBtn.addEventListener('click', logout);




