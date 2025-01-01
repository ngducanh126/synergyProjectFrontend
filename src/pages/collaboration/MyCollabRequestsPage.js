import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CollaborationPages.css'; // Import the shared CSS file

function MyCollabRequestsPage({ token }) {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('https://synergyproject.onrender.com/collaboration/requests-that-i-sent', {
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
    <div className="page-container">
      <h1 className="page-title">My Collaboration Requests</h1>
      {error && <p className="error-message">{error}</p>}
      <div className="collaborations-grid">
        {requests.map((req) => (
          <div className="collaboration-card" key={req.id}>
            <h2 className="collaboration-name">{req.collaboration_name}</h2>
            <p className="request-date">Requested at: {req.date || "N/A"}</p>
            <p className="status-label">Status: {req.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
  
}

export default MyCollabRequestsPage;
