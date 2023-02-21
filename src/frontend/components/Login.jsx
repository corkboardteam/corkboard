import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { UserAuth } from '../../backend/auth_functions/authContext';

const Login = () => {
  const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const { login } = UserAuth();
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        setError('');
        setLoading(true);
        await login(email, password);
        console.log('user logged in');
        navigate('/dashboard');

    } catch(error) {
        setError('Failed to login')
        console.log(error.message);
    }
    setLoading(false);
}
  return (
    <>
    <div style={{ display: "flex", flexDirection: "column" }}>
      <h1 className='text-center text-3xl font-bold mt-4'>
        Welcome to Corkboard!
      </h1>
      <div className="card">
        <div className="card-body">
          <h2 className="text-center mb-4">Login</h2>
          <form onSubmit={handleSubmit}>
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