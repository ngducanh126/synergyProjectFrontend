import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function CollaborationsPage({ token }) {
  const [collaborations, setCollaborations] = useState([]);
  const [error, setError] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const fetchCollaborations = async () => {
      console.log('[DEBUG] Fetching all collaborations...');
      console.log('[DEBUG] Token being sent:', token);
      try {
        const response = await axios.get('http://127.0.0.1:5000/collaboration/view', {
          headers: {
            Authorization: `Bearer ${token}`,
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

    const fetchCurrentUserId = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('[DEBUG] Current user ID fetched:', response.data.id);
        setCurrentUserId(response.data.id);
      } catch (err) {
        console.error('[ERROR] Failed to fetch current user ID:', err.response?.data || err.message);
      }
    };

    fetchCollaborations();
    fetchCurrentUserId();
  }, [token]);

  const handleRequestToJoin = async (collabId) => {
    console.log(`[DEBUG] Requesting to join Collaboration ID: ${collabId}`);
    try {
      const response = await axios.post(
        `http://127.0.0.1:5000/collaboration/${collabId}/request`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('[DEBUG] Request to join successful:', response.data);
      alert('Request to join sent successfully!');
    } catch (err) {
      console.error('[ERROR] Failed to send request:', err.response?.data || err.message);
      alert(err.response?.data?.error || 'Failed to send request.');
    }
  };

  return (
    <div>
      <h1>Collaborations</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {collaborations.map((collab) => (
          <li key={collab.id}>
            <strong>{collab.name}</strong>: {collab.description} (Admin: {collab.admin_name})
            {currentUserId === collab.admin_id ? (
              <p style={{ color: 'green' }}>You are the admin of this collaboration.</p>
            ) : (
              <button onClick={() => handleRequestToJoin(collab.id)}>Request to Join</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CollaborationsPage;
