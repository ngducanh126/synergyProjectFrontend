import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';


function Profile({ token }) {
  const [profile, setProfile] = useState({});
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [location, setLocation] = useState('');
  const [availability, setAvailability] = useState('');
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

  // Update profile details
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        'http://127.0.0.1:5000/profile/update',
        { bio, skills: skills.split(','), location, availability },
        {
          headers: { Authorization: `Bearer ${token || localStorage.getItem('authToken')}` },
        }
      );
      alert('Profile updated successfully.');
    } catch (error) {
      alert('Failed to update profile.');
    }
  };

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
        navigate(`/collections/${id}`); // Redirect to the new collection page
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
            <pre>{JSON.stringify(profile, null, 2)}</pre>
        </div>

        {/* Form to update profile */}
        <form className="form" onSubmit={handleUpdate}>
            <h2>Update Profile</h2>
            <input
                type="text"
                placeholder="Bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
            />
            <input
                type="text"
                placeholder="Skills (comma-separated)"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
            />
            <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
            />
            <input
                type="text"
                placeholder="Availability"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
            />
            <button type="submit">Update Profile</button>
        </form>

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
