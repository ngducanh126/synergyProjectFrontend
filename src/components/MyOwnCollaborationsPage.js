import React, { useEffect, useState } from 'react';
import axios from 'axios';

function MyOwnCollaborationsPage({ token }) {
  const [collaborations, setCollaborations] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyCollaborations = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/collaboration/my', {
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
    <div>
      <h1>My Collaborations</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {collaborations.map((collab) => (
          <li key={collab.id}>
            {collab.name}: {collab.description}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MyOwnCollaborationsPage;
