import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    
    const [dataError, setDataError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setDataError('');

        try {
            const response = await axios.post('http://localhost:8080/api/user/login', formData, {
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.status === 200) {
                navigate(`/Home?username=${formData.username}`);
            }

        } catch (error) {
            setDataError(error.response?.data?.message || '*Invalid username or password');
            console.error(error);
        }


        console.log(formData);
        setFormData({
            username: '',
            password: ''
        });
    };

    const goToSignup = (e) => {
        e.preventDefault(); 
        // window.location.href = '/Signup';
        navigate('/Signup'); 
    };
    

    return (
        <div className="center-page">  
        
        <div className="login-form">
            <h2>Login</h2>
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
                </div>
                {/* <p>{dataError}</p> */}
                {dataError && <p className="error-message">{dataError}</p>}
                <div className="button-container">
                    <button type="submit" className="login-button" >Login</button>
                    <button className='signup' onClick={goToSignup}>Go To Sign Up</button>
                    
                    
                </div>
            </form>
        </div>
    </div>
    );
};

export default Login;