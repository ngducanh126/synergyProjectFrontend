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
        <div className="collaborations-list">
          {collaborations.map((collab) => (
            <div className="collaboration-card" key={collab.id}>
              <h2 className="collaboration-name">{collab.name}</h2>
              <p className="collaboration-description">{collab.description}</p>
              <button
                className="start-matching-button"
                onClick={() =>
                  navigate(`/match?collaboration_id=${collab.id}`) // Pass collaboration_id as a query parameter
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
