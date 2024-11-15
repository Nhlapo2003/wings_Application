import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';


function Login({ onLogin }) {
    const [values, setValues] = useState({
        email: '',
        password: '',
    });

    const navigate = useNavigate();

    const handleInput = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const res = await axios.post('http://localhost:8087/login', values);
            if (res.data === "Success") {
                onLogin();  // Update parent state to mark the user as logged in
                navigate('/home');  // Redirect to home/dashboard
            } else {
                alert("Login failed: " + res.data);
            }
        } catch (err) {
            console.error("Login error:", err);
            alert('Login failed: Unable to connect to the server');
        }
    };

    return (
        <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
            <div className='bg-white p-3 rounded w-25'>
                <h2 id='signin'>Sign In</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor='email'>Email</label>
                        <input
                            onChange={handleInput}
                            type='email'
                            placeholder='Enter Email'
                            className='form-control rounded-0'
                            name='email'
                            id='email'
                            value={values.email}
                            required
                        />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor='password'>Password</label>
                        <input
                            onChange={handleInput}
                            type='password'
                            placeholder='Enter Password'
                            className='form-control rounded-0'
                            name='password'
                            id='password'
                            value={values.password}
                            required
                        />
                    </div>
                    <button
                        id='login'
                        type='submit'
                        className='btn btn-success w-100'
                    >
                        <strong>Log In</strong>
                    </button>
                    <p>You agree to our terms and policies</p>
                    <Link
                        to='/signup'
                        className='btn btn-default border w-100 bg-light text-decoration-none'
                        id='createAccount'
                    >
                        Create Account
                    </Link>
                </form>
            </div>
        </div> 
    );
}

export default Login;
