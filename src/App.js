import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import Match from './components/Match';
import MyMatches from './components/MyMatches';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setToken('');
    setIsLoggedIn(false);
  };

  return (
    <div>
      <nav>
        <Link to="/">Home</Link> | <Link to="/register">Register</Link> |{' '}
        <Link to="/login">Login</Link>
      </nav>
      <Routes>
        <Route
          path="/"
          element={<Home isLoggedIn={isLoggedIn} handleLogout={handleLogout} />}
        />
        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} setToken={setToken} />}
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/profile"
          element={
            isLoggedIn ? <Profile token={token} /> : <div>Please log in first.</div>
          }
        />
        <Route
          path="/match"
          element={
            isLoggedIn ? <Match token={token} /> : <div>Please log in first.</div>
          }
        />
        <Route
          path="/my-matches"
          element={
            isLoggedIn ? <MyMatches token={token} /> : <div>Please log in first.</div>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
