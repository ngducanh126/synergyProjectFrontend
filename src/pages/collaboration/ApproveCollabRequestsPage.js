import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CollaborationPages.css'; // Import the shared CSS file

function ApproveCollabRequestsPage({ token }) {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      console.log('[DEBUG] Fetching admin collaboration requests...');
      try {
        const response = await axios.get(
          'https://synergyproject.onrender.com/collaboration/view-requests-sent-to-me',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log('[DEBUG] Admin requests fetched:', response.data);
        setRequests(response.data);
        setError('');
      } catch (err) {
        console.error('[ERROR] Failed to fetch admin requests:', err.response?.data || err.message);
        setError(err.response?.data?.error || 'Failed to fetch admin requests.');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [token]);

  const handleDecision = async (requestId, status) => {
    console.log(`[DEBUG] Processing request ${requestId} with status: ${status}`);
    try {
      const response = await axios.put(
        `https://synergyproject.onrender.com/collaboration/requests/${requestId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('[DEBUG] Request processed successfully:', response.data);
      alert(`Request has been ${status}.`);
      setRequests((prevRequests) => prevRequests.filter((req) => req.id !== requestId));
    } catch (err) {
      console.error('[ERROR] Failed to process request:', err.response?.data || err.message);
      alert(err.response?.data?.error || 'Failed to process request.');
    }
  };

  if (loading) {
    return <p className="loading-message">Loading requests...</p>;
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Approve/Disprove Collaboration Requests</h1>
      {error && <p className="error-message">{error}</p>}
      {requests.length === 0 ? (
        <p className="empty-message">No requests to display.</p>
      ) : (
        <div className="requests-list">
          {requests.map((req) => (
            <div className="request-item" key={req.id}>
              <p>
                <strong>User:</strong> {req.requester_name} <br />
                <strong>Collaboration:</strong> {req.collaboration_name}
              </p>
              <button
                className="approve-button"
                onClick={() => handleDecision(req.id, 'approved')}
              >
                Approve
              </button>
              <button
                className="reject-button"
                onClick={() => handleDecision(req.id, 'rejected')}
              >
                Reject
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ApproveCollabRequestsPage;
