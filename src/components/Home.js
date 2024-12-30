import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

function Home({ isLoggedIn, handleLogout, token }) {
  const [popularCollaborations, setPopularCollaborations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularCollaborations = async () => {
      try {
        if (!token) return; // Wait for token to be passed
        const response = await axios.get('http://127.0.0.1:5000/collaboration/popular', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('[DEBUG] Popular Collaborations:', response.data);
        setPopularCollaborations(response.data);
      } catch (error) {
        console.error('Failed to fetch popular collaborations:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn) fetchPopularCollaborations();
  }, [isLoggedIn, token]);

  const handleRequestToJoin = async (collabId) => {
    try {
      await axios.post(
        `http://127.0.0.1:5000/collaboration/${collabId}/request`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Request to join sent successfully!');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to send request.');
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading state
  }

  return (
    <div className="home-container">
      <div className="logo"></div>

      {isLoggedIn ? (
        <>
          <div className="button-row">
            <Link to="/match">
              <button className="action-button">Match</button>
            </Link>
          </div>

          <div className="button-row">
            <Link to="/collaborations">
              <button className="action-button">View Collaborations</button>
            </Link>
            <Link to="/create-collaboration">
              <button className="action-button">Create a New Collaboration</button>
            </Link>
            <Link to="/manage-collaborations">
              <button className="action-button">Manage Collaborations</button>
            </Link>
          </div>

          <div className="popular-collaborations">
            <h2 className="section-title">Popular Collaborations</h2>
            <div className="collaborations-grid">
              {popularCollaborations.map((collab) => {
                console.log('[DEBUG] Popular Collaboration:', collab);
                const profilePictureUrl = collab.profile_picture
                  ? `http://127.0.0.1:5000/${collab.profile_picture}` // Prepend base URL
                  : null;

                return (
                  <div className="collaboration-card" key={collab.id}>
                    {/* Conditionally render the profile picture if it exists */}
                    {profilePictureUrl && (
                      <img
                        src={profilePictureUrl}
                        alt={`${collab.name} Profile`}
                        className="collaboration-image"
                        onError={(e) => {
                          console.error(
                            `[ERROR] Failed to load profile picture for Collaboration ID: ${collab.id}, URL: ${profilePictureUrl}`
                          );
                          e.target.style.display = 'none'; // Hide broken images
                        }}
                      />
                    )}
                    <h3 className="collaboration-name">{collab.name}</h3>
                    <p>{collab.description}</p>
                    <button className="info-button">Info</button>
                    <button
                      className="request-button"
                      onClick={() => handleRequestToJoin(collab.id)}
                    >
                      Request to Join
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="button-row">
            <Link to="/creators">
              <button className="action-button">View All Creators</button>
            </Link>
          </div>

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
