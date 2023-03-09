import React, { useState, useEffect } from "react"
import { UserAuth } from "../../backend/authContext"
import { Link, useNavigate } from "react-router-dom"

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const { resetPassword } = UserAuth();
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentUser } = UserAuth();
  const navigate = useNavigate()
  
  useEffect(() => {
    if (currentUser != null) {
      navigate('/Dashboard');
    } 
    console.log(currentUser)
  },[currentUser, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setMessage('');
      setError('');
      setLoading(true);
      await resetPassword(email);
      setMessage("Check your inbox for further instructions");
    } catch {
      setError("Failed to reset password");
    }

    setLoading(false);
  }

  return (
    <>
      <div className="card">
        <div className="card-body">
          <h2 className="text-center mb-4">Password Reset</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          {message && <div className="alert alert-success">{message}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input onChange={(e) => setEmail(e.target.value)} type="email" className="form-control" id="email" placeholder="Enter email" required />
            </div>
            <button disabled={loading} className="btn btn-primary w-100" type="submit">
              Reset Password
            </button>
          </form>
          <div className="w-100 text-center mt-3">
            <Link to="/Login">Login</Link>
          </div>
        </div>
      </div>
      <div className="w-100 text-center mt-2">
        Need an account? <Link to="/Signup">Sign Up</Link>
      </div>
    </>
  )
}

export default ForgotPassword