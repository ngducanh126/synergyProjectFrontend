import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CollaborationPages.css'; // Import the shared CSS file

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function MyOwnCollaborationsPage({ token }) {
  const [collaborations, setCollaborations] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyCollaborations = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/collaboration/collaborations-i-own`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCollaborations(response.data);
      } catch (err) {
        setError('Failed to fetch your collaborations.');
      }
    };

    fetchMyCollaborations();
  }, [token]);

  return (
    <div className="page-container">
      <h1 className="page-title">My Collaborations</h1>
      {error && <p className="error-message">{error}</p>}
      <div className="collaborations-grid">
        {collaborations.map((collab) => (
          <div className="collaboration-card" key={collab.id}>
            <h2 className="collaboration-name">{collab.name}</h2>
            <p className="collaboration-description">{collab.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyOwnCollaborationsPage;
