import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './signup.css';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    });

    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value.trim()
        });
    };

    const goToLogin = (e) => {
        e.preventDefault();      
        navigate('/Login');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setPasswordError('');
        setUsernameError('');

        if (formData.password !== formData.confirmPassword) {
            setPasswordError('*Passwords do not match')
            return;
        }

            try {
                const response = await axios.post('http://localhost:8080/api/user/signup',{
                    username: formData.username,
                password: formData.password
                });
    
                if (response.status === 201) {
                    console.log('User created successfully');
                    navigate(`/Home?username=${formData.username}`);
                }
            } catch (error) {
                setUsernameError(error.response?.data?.message || '*Username already exists');
                console.error(error);
            }

        setFormData({
            username: '',
            password: '',
            confirmPassword: ''
        });
        
    };

    return (
    <div className="center-page">
        <div className="signup-form">
            <h2>Sign Up</h2>
            <p>Continue to doc editor</p>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <label id='confirm' htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>
                {usernameError && <p className="error-message">{usernameError}</p>}
                {passwordError && <p className="error-message">{passwordError}</p>}          
                <div className='button-container'>
                    <button type="submit">Sign Up</button>
                    <button className="login" onClick={goToLogin}>Go to Log In</button>
                </div>
            </form>
        </div>
    </div>
    );
};

export default Signup;