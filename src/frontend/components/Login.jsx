import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { Form, Button, Card, Alert } from 'react-bootstrap'
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
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h1 className='text-center text-3xl font-bold mt-4'>
        Welcome to Corkboard!
      </h1>
      <Card>
        <Card.Body>
        <h2 className="text-center mb-4">Login</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Control onChange={(e) => setEmail(e.target.value)} type="email"  placeholder='Email' required />
            </Form.Group>
            <h2 className='mb-4'> </h2>
            <Form.Group id="password">
              <Form.Control onChange={(e) => setPassword(e.target.value)} type="password" placeholder='Password' required />
            </Form.Group>
            <Button disabled={loading} className="w-100 mt-4" type="submit">
              Login
            </Button>
          </Form>
          <div className="w-100 text-center mt-3">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </div>
    </div>
  </>
  ) 
}

export default Login