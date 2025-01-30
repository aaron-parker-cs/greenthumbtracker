import axios from "axios";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
    const [inputs, setInputs] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputs(prev => ({...prev, [e.target.id]: e.target.value}));
    };

    const handleSubmit = async  (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(inputs);
        try {
            await axios.post("/api/auth/login", inputs);
            navigate('/');
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                setError(err.response.data);
            } else {
                setError('An unexpected error occurred');
            }
        }
    };

    return (
        <div className="auth">
            
            <Form onSubmit={handleSubmit}>
                <h1>Login</h1>
                <Form.Group className="mb-3" controlId="username">
                    <Form.Control type="text" placeholder="username" required onChange={handleChange}/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                    <Form.Control type="password" placeholder="password" required onChange={handleChange} />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Login
                </Button>

                {error && (<p className="error">{error}</p>)}

                <span>Don't have an account? <Link to="/register">Register</Link></span>
            </Form>
        </div>
    );
}

export default Login;