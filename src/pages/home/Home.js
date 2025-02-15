import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function Home({ isLoggedIn, handleLogout, token }) {
  const [popularCollaborations, setPopularCollaborations] = useState([]);
  const [userCollaborations, setUserCollaborations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { state: { message: 'You are not logged in, log in first.' } });
      return;
    }

    const fetchPopularCollaborations = async () => {
      try {
        if (!token) return;
        const response = await axios.get(`${API_BASE_URL}/collaboration/popular`, {
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

    const fetchUserCollaborations = async () => {
      // get all collabs that I am member or admin of
      try {
        const response = await axios.get(`${API_BASE_URL}/profile/view`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('[DEBUG] User Collaborations:', response.data.collaborations);
        setUserCollaborations(response.data.collaborations);
      } catch (error) {
        console.error('Failed to fetch user collaborations:', error.response?.data || error.message);
      }
    };

    fetchPopularCollaborations();
    fetchUserCollaborations();
  }, [isLoggedIn, token, navigate]);

  const handleRequestToJoin = async (collabId) => {
    try {
      await axios.post(
        `${API_BASE_URL}/collaboration/${collabId}/request`,
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
    return <div>Loading...</div>;
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
                  ? `${API_BASE_URL}/${collab.profile_picture}`
                  : null;

                const userCollab = userCollaborations.find((userCollab) => userCollab.id === collab.id);
                const isAdmin = userCollab?.role === 'admin';

                return (
                  <div className="collaboration-card" key={collab.id}>
                    {profilePictureUrl && (
                      <img
                        src={profilePictureUrl}
                        alt={`${collab.name} Profile`}
                        className="collaboration-image"
                        onError={(e) => {
                          console.error(
                            `[ERROR] Failed to load profile picture for Collaboration ID: ${collab.id}, URL: ${profilePictureUrl}`
                          );
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                    <h3 className="collaboration-name">{collab.name}</h3>
                    <p>{collab.description}</p>
                    <button
                      className="info-button"
                      onClick={() =>
                        navigate(`/collaborations/${collab.id}`, { state: { isAdmin } })
                      }
                    >
                      Info
                    </button>
                    {userCollab ? (
                      isAdmin ? (
                        <p className="admin-label">You are the admin</p>
                      ) : (
                        <p className="member-label">You are a member</p>
                      )
                    ) : (
                      <button
                        className="request-button"
                        onClick={() => handleRequestToJoin(collab.id)}
                      >
                        Request to Join
                      </button>
                    )}
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
            <Link to="/my-likes">
              <button className="bottom-button">Likes</button>
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
