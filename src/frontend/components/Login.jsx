import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { GoogleButton } from 'react-google-button'
import { UserAuth } from '../../backend/authContext';

const Login = () => {
  const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const { currentUser, login, googleLogin } = UserAuth();
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
        setError('');
        setLoading(true);
        await login(email, password);

    } catch(error) {
        setError('Failed to login')
        console.log(error.message);
    }
    setLoading(false);
}

const handleGoogleLogin = async (e) => {
  e.preventDefault()
  try {
    setError('');
    setLoading(true);

    await googleLogin();
    console.log('user logged in');
    
  } catch (error) {
    setError(error);
    console.log(error)
  }
  setLoading(false);
  
}

useEffect(() => {
  if (currentUser != null) {
    if (currentUser.groupID == null) {
      navigate('group');
    } else {
      navigate('/dashboard');
    }
  } 
},)
  return (
    <>
    <div style={{ display: "flex", flexDirection: "column" }}>
      <h1 className='text-center text-3xl font-bold mt-4'>
        Welcome to Corkboard!
      </h1>
      
      <div className="card">
        <div className="card-body">
          <div className='text-center m-auto py-4'>
            <GoogleButton onClick={handleGoogleLogin} />
          </div>
          <h2 className="text-center mb-4">Login</h2>
          <form onSubmit={handleLogin}>   
            <div className="form-group mb-4" id="email">
              <input onChange={(e) => setEmail(e.target.value)} type="email" className="form-control" placeholder='Email' required />
            </div>
            <div className="form-group" id="password">
              <input onChange={(e) => setPassword(e.target.value)} type="password" className="form-control" placeholder='Password' required />
            </div>
            <button disabled={loading} className="btn btn-primary w-100 mt-4" type="submit">Login</button>
          </form>
          <div className="w-100 text-center mt-3">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>
        </div>
      </div>
      <div className="w-100 text-center mt-2">
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </div>
    </div>
    </>
  ) 
}

export default Login