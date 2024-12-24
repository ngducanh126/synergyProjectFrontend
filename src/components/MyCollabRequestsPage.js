import React, { useEffect, useState } from 'react';
import axios from 'axios';

function MyCollabRequestsPage({ token }) {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/collaboration/my-requests', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRequests(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch requests.');
      }
    };

    fetchRequests();
  }, [token]);

  return (
    <div>
      <h1>My Collaboration Requests</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {requests.map((req) => (
          <li key={req.id}>
            Collaboration: {req.collaboration_name} - Status: {req.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MyCollabRequestsPage;
