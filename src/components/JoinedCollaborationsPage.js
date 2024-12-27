import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CollaborationPages.css'; // Import the shared CSS file

function JoinedCollaborationsPage({ token }) {
  const [collaborations, setCollaborations] = useState([]);
  const [error, setError] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const fetchCollaborations = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/collaboration/joined', {
          headers: {
            Authorization: `Bearer ${token}`,
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

  return (
    <div className="page-container">
      <h1 className="page-title">Collaborations I Joined</h1>
      {error && <p className="error-message">{error}</p>}
      {collaborations.length === 0 ? (
        <p className="empty-message">No collaborations to display.</p>
      ) : (
        <div className="collaborations-list">
          {collaborations.map((collab) => (
            <div className="collaboration-card" key={collab.id}>
              <h2 className="collaboration-name">{collab.name}</h2>
              <p className="collaboration-description">{collab.description}</p>
              {currentUserId === collab.admin_id && (
                <p className="admin-label">You are the admin of this collaboration.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default JoinedCollaborationsPage;
