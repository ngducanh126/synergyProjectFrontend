import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CollaborationPages.css'; // Import shared CSS

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function CollaborationsPage({ token }) {
  const [collaborations, setCollaborations] = useState([]);
  const [error, setError] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [userCollaborations, setUserCollaborations] = useState([]); // Tracks collaborations user is part of with roles
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCollaborations = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/collaboration/view`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        console.log('[DEBUG] Collaborations data:', response.data);
        setCollaborations(response.data);
      } catch (err) {
        console.error('[ERROR] Failed to fetch collaborations:', err.response?.data || err.message);
        setError(err.response?.data?.error || 'Failed to fetch collaborations.');
      }
    };

    const fetchCurrentUserProfile = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/profile/view`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('[DEBUG] Current User Profile:', response.data);
        setCurrentUserId(response.data.id);
        setUserCollaborations(
          response.data.collaborations.map((collab) => ({
            id: collab.id,
            role: collab.role, // Include role information
          }))
        );
      } catch (err) {
        console.error('[ERROR] Failed to fetch current user profile:', err.response?.data || err.message);
      }
    };

    fetchCollaborations();
    fetchCurrentUserProfile();
  }, [token]);

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
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to send request.');
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Collaborations</h1>
      {error && <p className="error-message">{error}</p>}
      <div className="collaborations-grid">
        {collaborations.map((collab) => {
          console.log('[DEBUG] Collaboration:', collab);
          const profilePictureUrl = collab.profile_picture
            ? `${API_BASE_URL}/${collab.profile_picture}` // Prepend base URL
            : null;

          const userCollab = userCollaborations.find((userCollab) => userCollab.id === collab.id);
          const isAdmin = userCollab?.role === 'admin'; // Determine admin status

          return (
            <div className="collaboration-card" key={collab.id}>
              {/* Conditionally render the profile picture only if it exists */}
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
              <h2 className="collaboration-name">{collab.name}</h2>
              <button
                className="info-button"
                onClick={() => navigate(`/collaborations/${collab.id}`, { state: { isAdmin } })}
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
  );
}

export default CollaborationsPage;
