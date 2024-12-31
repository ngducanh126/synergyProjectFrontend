import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CollaborationPages.css';

function JoinedCollaborationsPage({ token }) {
  const [collaborations, setCollaborations] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
    fetchCollaborations();
  }, [token]);

  return (
    <div className="page-container">
      <h1 className="page-title">Collaborations I Joined</h1>
      {error && <p className="error-message">{error}</p>}
      {collaborations.length === 0 ? (
        <p className="empty-message">No collaborations to display.</p>
      ) : (
        <div className="collaborations-grid">
          {collaborations.map((collab) => (
            <div className="collaboration-card" key={collab.id}>
              {/* Display profile picture if it exists */}
              {collab.profile_picture && (
                <img
                  src={`http://127.0.0.1:5000/${collab.profile_picture}`}
                  alt={`${collab.name} Profile`}
                  className="collaboration-image"
                />
              )}
              <h2 className="collaboration-name">{collab.name}</h2>
              <p className="collaboration-description">{collab.description}</p>
              <p className="collaboration-role">Role: {collab.role}</p>
              {collab.role === 'admin' && (
                <button
                  className="edit-button"
                  onClick={() => navigate(`/edit-collaboration/${collab.id}`)}
                >
                  Edit
                </button>
              )}
              <button
                className="start-matching-button"
                onClick={() =>
                  navigate(`/match?collaboration_id=${collab.id}`)
                }
              >
                Start Matching
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default JoinedCollaborationsPage;
