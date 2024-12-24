import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
    <div>
      <h1>Collaborations I Joined</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {collaborations.map((collab) => (
          <li key={collab.id}>
            <strong>{collab.name}</strong> - {collab.description}
            {currentUserId === collab.admin_id ? (
              <p style={{ color: 'green' }}>You are the admin of this collaboration.</p>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default JoinedCollaborationsPage;
