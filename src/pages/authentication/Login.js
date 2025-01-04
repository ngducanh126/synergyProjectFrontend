import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css'; // Import the CSS file

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function Login({ setIsLoggedIn, setToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/login`, // Use backticks for template literals
        {
          username,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    
      const token = response.data.access_token;
      setToken(token);
      localStorage.setItem('authToken', token); // Save token to localStorage
      setIsLoggedIn(true);
      navigate('/');
    } catch (error) {
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="login-container">
      <div className="logo"></div> {/* Placeholder for the logo */}
      <form className="login-form" onSubmit={handleLogin}>
        <h1 className="login-title">Sign In</h1>
        <input
          type="text"
          placeholder="Email/Phone Number"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="login-input"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
          required
        />
        <Link to="/forgot-password" className="forgot-password">
          Forgot Password
        </Link>
        <button type="submit" className="login-button">
          Sign In
        </button>
        <div className="register-container">
          <span>New? </span>
          <Link to="/register" className="register-link">
            Register Now
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
