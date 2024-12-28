import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home({ isLoggedIn, handleLogout }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleCreateCollaboration = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5000/collaboration/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({ name, description }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Collaboration created successfully!');
        setName('');
        setDescription('');
      } else {
        alert(data.error || 'Failed to create collaboration.');
      }
    } catch (error) {
      console.error('Error creating collaboration:', error);
      alert('Error creating collaboration. Please try again.');
    }
  };

  return (
    <div className="home-container">
      {/* Logo */}
      <div className="logo"></div>

      {isLoggedIn ? (
        <>
          {/* Match Button */}
          <div className="button-row">
            <Link to="/match">
              <button className="action-button">Match</button>
            </Link>
          </div>

          {/* Collaboration Actions */}
          <div className="button-grid">
            <Link to="/collaborations">
              <button className="action-button">View Collaborations</button>
            </Link>
            {/* <Link to="/my-collaborations">
              <button className="action-button">Collaborations I created</button>
            </Link> */}
            <Link to="/my-collab-requests">
              <button className="action-button">My Collab Requests</button>
            </Link>
            <Link to="/approve-collab-requests">
              <button className="action-button">Approve/Disprove Collab Requests</button>
            </Link>
            <Link to="/joined-collaborations">
              <button className="action-button">Collabs I Joined</button>
            </Link>
            <Link to="/create-collaboration">
              <button className="action-button">Create a New Collaboration</button>
            </Link>
          </div>

          {/* Bottom Buttons */}
          <div className="bottom-buttons">
            <Link to="/profile">
              <button className="bottom-button">View Profile</button>
            </Link>
            <Link to="/my-matches">
              <button className="bottom-button">Matches</button>
            </Link>
            <button onClick={handleLogout} className="bottom-button">
              Log Out
            </button>
          </div>
        </>
      ) : (
        <div className="auth-buttons">
          <p>You are not logged in.</p>
          <Link to="/register">
            <button className="auth-button">Register</button>
          </Link>
          <Link to="/login">
            <button className="auth-button">Login</button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Home;
