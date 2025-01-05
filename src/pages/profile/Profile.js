import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function Profile({ token }) {
  const [profile, setProfile] = useState({});
  const [collections, setCollections] = useState([]);
  const [collaborations, setCollaborations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const navigate = useNavigate();

  // Fetch profile and collections
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/profile/view`, {
          headers: { Authorization: `Bearer ${token || localStorage.getItem('authToken')}` },
        });
        setProfile(response.data);
        setCollaborations(response.data.collaborations || []);
      } catch (error) {
        alert('Failed to fetch profile.');
      }
    };

    const fetchCollections = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/profile/collections`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCollections(response.data);
      } catch (error) {
        alert('Failed to fetch collections.');
      }
    };

    fetchProfile();
    fetchCollections();
  }, [token]);

  // Handle creating a new collection
  const handleCreateCollection = async (e) => {
    e.preventDefault();
    if (!newCollectionName.trim()) {
      alert('Collection name is required.');
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/profile/collections`,
        { name: newCollectionName },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const newCollectionId = response.data.id;
      setShowModal(false);
      setNewCollectionName('');
      navigate(`/collections/${newCollectionId}`);
    } catch (error) {
      alert('Failed to create collection.');
    }
  };

  return (
    <div className="profile-container">
      {/* Logo */}
      <header className="logo-container">
        <h1 className="logo">Synergy</h1>
      </header>

      {/* Profile Section */}
      <div className="profile-section">
        <div className="profile-picture-container">
          {profile.profile_picture ? (
            <img
              src={`${API_BASE_URL}/${profile.profile_picture}`} // Directly concatenate with API_BASE_URL
              alt="Profile"
              className="profile-picture"
            />
          ) : (
            <div className="default-profile-picture" />
          )}
          <h2 className="username">{profile.username || 'Username'}</h2>
        </div>
        <div className="bio-location">
          <p className="bio">{profile.bio || 'No bio provided'}</p>
          <p className="location">{profile.location || 'No location provided'}</p>
        </div>
        <button
          className="edit-profile-button"
          onClick={() => navigate('/profile/edit')}
        >
          Edit Profile
        </button>
      </div>

      {/* Skills and Collaborations */}
      <div className="details-section">
        <div className="skills-container">
          <h2>SkillSet</h2>
          <ul>
            {profile.skills?.length > 0 ? (
              profile.skills.map((skill, index) => <li key={index}>{skill}</li>)
            ) : (
              <p>No skills provided</p>
            )}
          </ul>
        </div>
        <div className="collaborations-container">
          <h2>Collabs</h2>
          <ul>
            {collaborations.length > 0 ? (
              collaborations.map((collab) => (
                <li key={collab.id}>
                  <p>{collab.name}</p>
                </li>
              ))
            ) : (
              <p>No collaborations available</p>
            )}
          </ul>
        </div>
      </div>

      {/* Portfolio Section */}
      <div className="portfolio-section">
        <h2>Portfolio</h2>
        <div className="portfolio-grid">
          {collections.map((collection) => (
            <div className="portfolio-card" key={collection.id}>
              <h3>{collection.name}</h3>
              <button onClick={() => navigate(`/collections/${collection.id}`)}>
                View and Add Items
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Create Collection Button */}
      <button
        className="create-collection-button"
        onClick={() => setShowModal(true)}
      >
        Create New Collection
      </button>

      {/* Modal for Creating Collection */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Create New Collection</h2>
            <form onSubmit={handleCreateCollection}>
              <input
                type="text"
                placeholder="Enter collection name"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                className="modal-input"
              />
              <button type="submit" className="modal-submit-button">
                Create
              </button>
              <button
                type="button"
                className="modal-cancel-button"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
