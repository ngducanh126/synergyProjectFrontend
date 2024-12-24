import React, { useState } from 'react';
import { Link } from 'react-router-dom';

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
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
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
    <div>
      <h1>Home Page</h1>
      {isLoggedIn ? (
        <>
          <p>You are logged in.</p>
          <Link to="/profile">
            <button>View Profile</button>
          </Link>
          <Link to="/match">
            <button>Match</button>
          </Link>
          <Link to="/my-matches">
            <button>My Matches</button>
          </Link>
          <Link to="/collaborations">
            <button>View Collaborations</button>
          </Link>
          <Link to="/my-collaborations">
            <button>View My Collaborations</button>
          </Link>
          <Link to="/my-collab-requests">
            <button>My Collab Requests</button>
          </Link>
          <Link to="/approve-collab-requests">
            <button>Approve/Disprove Collab Requests</button>
          </Link>
          <Link to="/joined-collaborations">
            <button>Collabs I Joined</button>
          </Link>
          
          <button onClick={handleLogout}>Log Out</button>

          {/* Form to create a new collaboration */}
          <div style={{ marginTop: '20px' }}>
            <h2>Create a New Collaboration</h2>
            <form onSubmit={handleCreateCollaboration}>
              <input
                type="text"
                placeholder="Collaboration Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <br />
              <textarea
                placeholder="Collaboration Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <br />
              <button type="submit">Create Collaboration</button>
            </form>
          </div>
        </>
      ) : (
        <>
          <p>You are not logged in.</p>
          <Link to="/register">
            <button>Register</button>
          </Link>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </>
      )}
    </div>
  );
}

export default Home;
