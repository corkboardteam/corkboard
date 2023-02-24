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

  useEffect(() => {
    if (currentUser != null) {
      navigate('/dashboard');
    } 
    console.log(currentUser)
  },[currentUser, navigate]);

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
    
  } catch (error) {
    setError(error);
    console.log(error)
  }
  setLoading(false);
  
}

  return (
    <>
    <div style={{ flexDirection: "column", alignItems: "center"  }}>
      <h1 className='text-center text-3xl font-bold mt-4' >
        Welcome to Corkboard!
      </h1>
      <div className="card" style={{ maxWidth: "600px" }}>
        <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
         <div style={{ display: "flex", justifyContent: "center", marginBottom: "2rem", marginTop: "2rem" }}>
            <GoogleButton onClick={handleGoogleLogin} />
          </div>
          <h2 className="text-center mb-4">Login</h2>
          <form onSubmit={handleLogin}>   
            <div className="form-group mb-4" id="email">
              <label htmlFor="email" className="form-label">Email</label>
              <input onChange={(e) => setEmail(e.target.value)} type="email" className="form-control" placeholder='Email' required />
            </div>
            <div className="form-group" id="password">
              <label htmlFor="password" className="form-label">Password</label>
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