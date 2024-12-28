import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CollaborationPages.css'; // Import shared CSS

function CollaborationsPage({ token }) {
  const [collaborations, setCollaborations] = useState([]);
  const [error, setError] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const fetchCollaborations = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/collaboration/view', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setCollaborations(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch collaborations.');
      }
    };

    const fetchCurrentUserId = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCurrentUserId(response.data.id);
      } catch (err) {
        console.error('[ERROR] Failed to fetch current user ID:', err.response?.data || err.message);
      }
    };

    fetchCollaborations();
    fetchCurrentUserId();
  }, [token]);

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
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to send request.');
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Collaborations</h1>
      {error && <p className="error-message">{error}</p>}
      <div className="collaborations-grid">
      {collaborations.map((collab) => (
        <div className="collaboration-card" key={collab.id}>
          {/* Conditionally render the image only if collab.photo exists */}
          {collab.photo && (
            <img
              src={collab.photo}
              alt={collab.name}
              className="collaboration-image"
            />
          )}
          <h2 className="collaboration-name">{collab.name}</h2>
          <button className="info-button">Info</button>
          {currentUserId === collab.admin_id ? (
            <p className="admin-label">You are the admin</p>
          ) : (
            <button
              className="request-button"
              onClick={() => handleRequestToJoin(collab.id)}
            >
              Request to Join
            </button>
          )}
        </div>
      ))}
    </div>

    </div>
  );
}

export default CollaborationsPage;
