import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Signup() {
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleInput = (event) => {
        setValues((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrors({});

        // Basic validation
        if (!values.name || !values.email || !values.password) {
            setErrors({
                name: !values.name ? 'Name is required' : '',
                email: !values.email ? 'Email is required' : '',
                password: !values.password ? 'Password is required' : ''
            });
            return;
        }

        try {
            const response = await axios.post('http://localhost:8087/signup', values);
            if (response.data) {
                console.log('Response:', response.data);
                alert('Signup successful!');
                navigate('/'); // Redirect to login page after successful signup
            }
        } catch (err) {
            console.error("Signup error:", err);
            if (err.response) {
                alert('Signup failed: ' + (err.response.data.message || 'Server error'));
            } else if (err.request) {
                alert('Signup failed: Unable to connect to the server');
            } else {
                alert('Signup failed: ' + err.message);
            }
        }
    };

    return (
        <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
            <div className='bg-white p-3 rounded w-25'>
                <h2>Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor='name'>Name</label>
                        <input
                            onChange={handleInput}
                            type='text'
                            placeholder='Enter Name'
                            className='form-control rounded-0'
                            name='name'
                            id='name'
                            value={values.name}
                        />
                        {errors.name && <div className="text-danger">{errors.name}</div>}
                    </div>
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
                        />
                        {errors.email && <div className="text-danger">{errors.email}</div>}
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
                        />
                        {errors.password && <div className="text-danger">{errors.password}</div>}
                    </div>
                    <button id='signup' type='submit' className='btn btn-success w-100'>
                        <strong>Sign Up</strong>
                    </button>
                    <p>You agree to our terms and policies</p>
                    <Link
                        to='/'
                        className='btn btn-default border w-100 bg-light text-decoration-none'
                    >
                        Login
                    </Link>
                </form>
            </div>
        </div>
    );
}

export default Signup;