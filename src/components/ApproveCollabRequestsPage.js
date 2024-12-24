import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ApproveCollabRequestsPage({ token }) {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchRequests = async () => {
      console.log('[DEBUG] Fetching admin collaboration requests...');
      try {
        const response = await axios.get(
          'http://127.0.0.1:5000/collaboration/admin-requests',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log('[DEBUG] Admin requests fetched:', response.data);
        setRequests(response.data);
        setError(''); // Clear any previous errors
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
        `http://127.0.0.1:5000/collaboration/requests/${requestId}`,
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
      // Update the state to remove the processed request
      setRequests((prevRequests) => prevRequests.filter((req) => req.id !== requestId));
    } catch (err) {
      console.error('[ERROR] Failed to process request:', err.response?.data || err.message);
      alert(err.response?.data?.error || 'Failed to process request.');
    }
  };

  if (loading) {
    return <p>Loading requests...</p>;
  }

  return (
    <div>
      <h1>Approve/Disprove Collaboration Requests</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {requests.length === 0 ? (
        <p>No requests to display.</p>
      ) : (
        <ul>
          {requests.map((req) => (
            <li key={req.id}>
              <p>
                <strong>User:</strong> {req.requester_name} <br />
                <strong>Collaboration:</strong> {req.collaboration_name}
              </p>
              <button onClick={() => handleDecision(req.id, 'approved')}>Approve</button>
              <button onClick={() => handleDecision(req.id, 'rejected')}>Reject</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ApproveCollabRequestsPage;
