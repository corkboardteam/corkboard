import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { UserAuth } from '../../backend/auth_functions/authContext';

export const Signup = () => {

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const { signUp } = UserAuth();
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
			e.preventDefault();

			try {
					setError('');
					setLoading(true);
					await signUp(email, password);
					console.log('user created');
					navigate('/dashboard');

			} catch(error) {
					setError('Failed to create an account')
					console.log(error.message);
			}
			setLoading(false);
	}
	return (
		<>
		<Card>
			<Card.Body>
				<h2 className="text-center mb-4">Sign Up</h2>
				{error && <Alert variant='danger'>{error}</Alert>}
				<Form onSubmit={handleSubmit}>
					<Form.Group id="email">
						<Form.Control onChange={(e) => setEmail(e.target.value)} type="email"  placeholder='Email' required />
					</Form.Group>
					<h2 className='mb-4'> </h2>
					<Form.Group id="password">
						<Form.Control onChange={(e) => setPassword(e.target.value)} type="password" placeholder='Password' required />
					</Form.Group>
					<Button disabled={loading} className="w-100 mt-4" type="submit">
						Sign Up
					</Button>
				</Form>
			</Card.Body>
		</Card>
		<div className="w-100 text-center mt-2">
			Already have an account? <Link to="/">Login</Link>
		</div>
	</>
	) 
}
export default Signup