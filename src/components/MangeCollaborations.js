import React from 'react';
import { Link } from 'react-router-dom';
import './ManageCollaborations.css';

function ManageCollaborations() {
  return (
    <div className="manage-collaborations-container">
      <h1 className="header">Manage Collaborations</h1>
      <div className="button-grid">
        <Link to="/my-collab-requests">
          <button className="action-button">My Collab Requests</button>
        </Link>
        <Link to="/approve-collab-requests">
          <button className="action-button">Approve/Disprove Collab Requests</button>
        </Link>
        <Link to="/joined-collaborations">
          <button className="action-button">Collabs I Joined</button>
        </Link>
        <Link to="/create-collaboration">
          <button className="action-button">Create a New Collaboration</button>
        </Link>
      </div>
    </div>
  );
}

export default ManageCollaborations;
