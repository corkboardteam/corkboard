import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { UserAuth } from '../../backend/authContext';

const Signup = () => {
  
  const { currentUser } = UserAuth();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const { signUp } = UserAuth();
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
  
  useEffect(() => {
    if (currentUser != null) {
      navigate('/');
    } 
    console.log(currentUser);
  }, [currentUser, navigate]);

	const handleSubmit = async (e) => {
			e.preventDefault();
			
			try {
					setError('');
					setLoading(true);
					await signUp(email, password);
					navigate('/');

			} catch(error) {
					setError('Failed to create an account')
					console.log(error.message);
			}
			setLoading(false);
	}
	return (
		<>
      <div className="card">
        <div className="card-body">
          <h2 className="text-center mb-4">Sign Up</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                className="form-control" 
				        type="email" 
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input 
			  	className="form-control"
			  	type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
            </div>
            <button disabled={loading} className="btn btn-primary w-100 mt-4" type="submit">Sign Up</button>
          </form>
        </div>
      </div>
      <div className="w-100 text-center mt-2">
        Already have an account? <Link to="/Login">Login</Link>
      </div>
    </>
	) 
}
export default Signup