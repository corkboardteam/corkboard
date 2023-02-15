import app from './config';
import { AuthErrorCodes } from 'firebase/auth';
import { 
    getAuth, onAuthStateChanged, signOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword, } from 'firebase/auth';

export const usrEmail = document.querySelector('#usrEmail');
export const usrPassword = document.querySelector('#usrPassword');

export const btnLogin = document.querySelector('#btnLogin');
export const btnSignup = document.querySelector('#btnSignup');

export const btnLogout = document.querySelector('#btnLogout');

export const authState = document.querySelector('#authState');

export const loginError = document.querySelector('#loginError');
export const loginErrorMsg = document.querySelector('#loginErrorMsg');

export const showLoginForm = () => {
    login.style.display = 'block';
    app.style.display = 'none';
}

export const showApp = () => {
    login.style.display = 'none';
    app.style.display = 'block';
}

export const hideLoginError = () => {
    loginError.style.display = 'none';
    loginErrorMsg.innerHTML = '';
}
  
export const showLoginError = (error) => {
    loginError.style.display = 'block';
    if (error.code == AuthErrorCodes.INVALID_PASSWORD) {
        loginErrorMsg.innerHTML = `Wrong password. Try again.`;
    }
    else {
        loginErrorMsg.innerHTML = `Error: ${error.message}`; 
    }
}
  
export const showLoginState = (user) => {
    authState.innerHTML = `You're logged in as ${user.displayName} (uid: ${user.uid}, email: ${user.email}) `;
}
  
hideLoginError()

// Login using email/password
const loginEmailPassword = async () => {
  const loginEmail = usrEmail.value
  const loginPassword = usrPassword.value

  try {
    await signInWithEmailAndPassword(auth, loginEmail, loginPassword)
  }
  catch(error) {
    console.log(`There was an error: ${error}`)
    showLoginError(error)
  }
}

// Create new account using email/password
const createAccount = async () => {
  const email = usrEmail.value
  const password = usrPassword.value

  try {
    await createUserWithEmailAndPassword(auth, email, password)
  }
  catch(error) {
    console.log(`There was an error: ${error}`)
    showLoginError(error)
  } 
}

// Monitor auth state
const monitorAuthState = async () => {
  onAuthStateChanged(auth, user => {
    if (user) {
      console.log(user)
      showApp()
      showLoginState(user)

      hideLoginError()
    }
    else {
      showLoginForm()
      authState.innerHTML = `You're not logged in.`
    }
  })
}

// Log out
const logout = async () => {
  await signOut(auth);
}

btnLogin.addEventListener("click", loginEmailPassword) 
btnSignup.addEventListener("click", createAccount)
btnLogout.addEventListener("click", logout)

const auth = getAuth(app);

monitorAuthState();



