import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';

function Profile({ token }) {
  const [profile, setProfile] = useState({});
  const [collections, setCollections] = useState([]);
  const [newCollectionName, setNewCollectionName] = useState('');
  const navigate = useNavigate();

  // Fetch profile and collections
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/profile/view', {
          headers: { Authorization: `Bearer ${token || localStorage.getItem('authToken')}` },
        });
        setProfile(response.data);
      } catch (error) {
        alert('Failed to fetch profile.');
      }
    };

    const fetchCollections = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/profile/collections', {
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

  // Create a new collection
  const handleCreateCollection = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://127.0.0.1:5000/profile/collections',
        { name: newCollectionName },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const { id } = response.data; // Extract the id from the response
      if (id) {
        setNewCollectionName('');
        setCollections((prev) => [...prev, { id, name: newCollectionName }]); // Add new collection to the list
        alert('Collection created successfully.');
      } else {
        alert('Failed to retrieve collection ID. Please try again.');
      }
    } catch (error) {
      console.error('Failed to create collection:', error.response?.data || error.message);
      alert('Failed to create collection.');
    }
  };

  return (
    <div className="profile-container">
      <h1 className="profile-title">Your Profile</h1>

      {/* Profile details */}
      <div className="profile-details">
        {profile.profile_picture && (
          <img
            src={`http://127.0.0.1:5000/${profile.profile_picture}`} // Use the relative path stored in the DB
            alt="Profile"
            className="profile-picture"
          />
        )}
        <h2>Username: {profile.username}</h2>
        <p>Bio: {profile.bio || 'No bio provided'}</p>
        <p>Skills: {profile.skills?.join(', ') || 'No skills provided'}</p>
        <p>Location: {profile.location || 'No location provided'}</p>
        <p>Availability: {profile.availability || 'No availability status provided'}</p>
      </div>
      <button
        className="edit-profile-button"
        onClick={() => navigate('/profile/edit')}
      >
        Edit Profile
      </button>

      {/* Display collections */}
      <div className="collections">
        <h2>Your Collections</h2>
        <ul className="collection-list">
          {collections.map((collection) => (
            <li className="collection-item" key={collection.id}>
              <h3>{collection.name}</h3>
              <button onClick={() => navigate(`/collections/${collection.id}`)}>
                View and Add Items
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Form to create a new collection */}
      <form className="form" onSubmit={handleCreateCollection}>
        <input
          type="text"
          placeholder="New Collection Name"
          value={newCollectionName}
          onChange={(e) => setNewCollectionName(e.target.value)}
          required
        />
        <button type="submit">Create Collection</button>
      </form>
    </div>
  );
}

export default Profile;
