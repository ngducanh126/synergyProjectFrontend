import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CollaborationPages.css';

function EditCollaborationPage({ token }) {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCollaborationDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/collaboration/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const { name, description, profile_picture } = response.data;
        setName(name || '');
        setDescription(description || '');
        setProfilePicture(profile_picture || null);
      } catch (err) {
        setError('Failed to fetch collaboration details.');
      }
    };

    fetchCollaborationDetails();
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
      await axios.put(`http://127.0.0.1:5000/collaboration/edit/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccessMessage('Collaboration updated successfully!');
      setTimeout(() => navigate('/collaborations'), 2000);
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
    </div>
  );
}

export default EditCollaborationPage;
