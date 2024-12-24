import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import axios from 'axios'; // Import axios

function CollaborationsPage({ token }) {
  const [collaborations, setCollaborations] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCollaborations = async () => {
      console.log('[DEBUG] Fetching all collaborations...');
      console.log('[DEBUG] Token being sent:', token); // Log the token for debugging
      try {
        const response = await axios.get('http://127.0.0.1:5000/collaboration/view', {
          headers: {
            Authorization: `Bearer ${token}`, // Ensure the token is passed
            'Content-Type': 'application/json',
          },
        });

        console.log('[DEBUG] Collaborations fetched from backend:', response.data);
        setCollaborations(response.data);
      } catch (err) {
        console.error('[ERROR] Failed to fetch collaborations:', err.response?.data || err.message);
        setError(err.response?.data?.error || 'Failed to fetch collaborations.');
      }
    };

    fetchCollaborations();
  }, [token]);

  return (
    <div>
      <h1>Collaborations</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {collaborations.map((collab) => (
          <li key={collab.id}>
            <strong>{collab.name}</strong>: {collab.description} (Admin: {collab.admin_name})
            <br />
            <Link to={`/collaborations/${collab.id}`}>
              <button>View Details</button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CollaborationsPage;
