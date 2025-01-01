import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CollaborationPages.css';

function EditCollaborationPage({ token }) {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [members, setMembers] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCollaborationDetails = async () => {
      try {
        const response = await axios.get(`https://synergyproject.onrender.com/collaboration/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const { name, description } = response.data;
        setName(name || '');
        setDescription(description || '');
      } catch (err) {
        setError('Failed to fetch collaboration details.');
      }
    };
  
    const fetchMembers = async () => {
      try {
        const response = await axios.get(`https://synergyproject.onrender.com/collaboration/${id}/members`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMembers(response.data.members);
      } catch (err) {
        console.error('Error fetching members:', err);
      }
    };
  
    fetchCollaborationDetails();
    fetchMembers();
  }, [id, token]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!name.trim()) {
      setError('Collaboration name is required.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    if (profilePicture instanceof File) {
      formData.append('profile_picture', profilePicture);
    }

    try {
      await axios.put(`https://synergyproject.onrender.com/collaboration/edit/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccessMessage('Collaboration updated successfully!');
      // setTimeout(() => navigate('/collaborations'), 2000);
    } catch (err) {
      setError('Failed to update collaboration.');
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Edit Collaboration</h1>
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <form className="collaboration-form" onSubmit={handleSubmit}>
        <label htmlFor="collaboration-name" className="form-label">
          Name:
        </label>
        <input
          id="collaboration-name"
          type="text"
          placeholder="Collaboration Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="collaboration-input"
        />

        <label htmlFor="collaboration-description" className="form-label">
          Description:
        </label>
        <textarea
          id="collaboration-description"
          placeholder="Collaboration Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="collaboration-textarea"
        ></textarea>

        <label htmlFor="profile-picture" className="form-label">
          Profile Picture:
        </label>
        <input
          id="profile-picture"
          type="file"
          onChange={(e) => setProfilePicture(e.target.files[0])}
          className="collaboration-input"
        />

        <button type="submit" className="action-button">
          Save Changes
        </button>
      </form>

      <h2 className="members-title">Members</h2>
      <div className="creators-grid">
        {members.map((member) => (
          <div key={member.id} className="creator-card">
            <h3 className="creator-username">{member.username}</h3>
            <p className="creator-bio">{member.bio || 'No bio provided.'}</p>
            <p className="creator-location">Location: {member.location || 'N/A'}</p>
            {member.skills && <p className="creator-skills">Skills: {member.skills}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default EditCollaborationPage;
