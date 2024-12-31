import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './CollaborationDetailsPage.css';

function CollaborationDetailsPage({ token }) {
  const { collaborationId } = useParams();
  const [collaboration, setCollaboration] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchCollaborationDetails = async () => {
      try {
        // Fetch collaboration details
        const response = await axios.get(`http://127.0.0.1:5000/collaboration/${collaborationId}`, {
          headers: {
            Authorization: `Bearer ${token || localStorage.getItem('authToken')}`,
          },
        });
        setCollaboration(response.data);

        // Fetch current user ID
        const currentUserResponse = await axios.get('http://127.0.0.1:5000/auth/me', {
          headers: {
            Authorization: `Bearer ${token || localStorage.getItem('authToken')}`,
          },
        });
        setCurrentUserId(currentUserResponse.data.id);

        // Check if the current user is the admin
        if (currentUserResponse.data.id === response.data.admin_id) {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error('Error fetching collaboration details:', error.response?.data || error.message);
      }
    };

    fetchCollaborationDetails();
  }, [collaborationId, token]);

  const handleRequestToJoin = async () => {
    try {
      await axios.post(
        `http://127.0.0.1:5000/collaboration/${collaborationId}/request`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token || localStorage.getItem('authToken')}`,
          },
        }
      );
      alert('Request to join sent successfully!');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to send request.');
    }
  };

  if (!collaboration) {
    return <div className="loading-message">Loading collaboration details...</div>;
  }

  return (
    <div className="page-container">
      <h1 className="page-title">{collaboration.name}</h1>
      <div className="collaboration-card">
        {collaboration.profile_picture ? (
          <img
            src={`http://127.0.0.1:5000/${collaboration.profile_picture}`}
            alt={`${collaboration.name} Profile`}
            className="collaboration-image"
          />
        ) : (
          <div className="profile-placeholder">No Picture</div>
        )}
        <p className="collaboration-description">{collaboration.description || 'No description provided.'}</p>
        <p className="admin-label">Admin: {collaboration.admin_name || 'Unknown'}</p>

        {!isAdmin && (
          <button className="request-button" onClick={handleRequestToJoin}>
            Request to Join
          </button>
        )}
      </div>
    </div>
  );
}

export default CollaborationDetailsPage;
