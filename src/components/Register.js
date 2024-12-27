import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Login.css'; // Reuse the same CSS file

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:5000/auth/register', {
        username,
        password,
      });
      alert('Registration successful. You can now log in.');
    } catch (error) {
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="logo"></div> {/* Placeholder for the logo */}
      <form className="login-form" onSubmit={handleRegister}>
        <h1 className="login-title">Register</h1>
        <input
          type="text"
          placeholder="Username"
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
        <button type="submit" className="login-button">
          Register
        </button>
        <div className="register-container">
          <span>Already have an account? </span>
          <Link to="/login" className="register-link">
            Sign In
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Register;
