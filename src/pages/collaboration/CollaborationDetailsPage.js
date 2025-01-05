import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CollaborationDetailsPage.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function CollaborationDetailsPage({ token }) {
  const { collaborationId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [collaboration, setCollaboration] = useState(null);
  const isAdmin = state?.isAdmin || false; // Use passed prop for admin status

  useEffect(() => {
    const fetchCollaborationDetails = async () => {
      try {
        // Fetch collaboration details
        const response = await axios.get(`${API_BASE_URL}/collaboration/${collaborationId}`, {
          headers: {
            Authorization: `Bearer ${token || localStorage.getItem('authToken')}`,
          },
        });
        setCollaboration(response.data);
      } catch (error) {
        console.error('Error fetching collaboration details:', error.response?.data || error.message);
      }
    };

    fetchCollaborationDetails();
  }, [collaborationId, token]);

  const handleRequestToJoin = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/collaboration/${collaborationId}/request`,
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
            src={`${API_BASE_URL}/${collaboration.profile_picture}`}
            alt={`${collaboration.name} Profile`}
            className="collaboration-image"
          />
        ) : (
          <div className="profile-placeholder">No Picture</div>
        )}
        <p className="collaboration-description">{collaboration.description || 'No description provided.'}</p>
        {isAdmin ? (
          <>
            <p className="admin-label">You are the admin of this collaboration.</p>
            <button
              className="edit-button"
              onClick={() => navigate(`/edit-collaboration/${collaborationId}`)}
            >
              Edit
            </button>
          </>
        ) : (
          <p className="admin-label">Admin: {collaboration.admin_name || 'Unknown'}</p>
        )}
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
