import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './EditProfile.css'; // Add your CSS styling

function EditProfile({ token }) {
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [location, setLocation] = useState('');
  const [availability, setAvailability] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [currentProfilePicture, setCurrentProfilePicture] = useState('');
  const navigate = useNavigate();

  // Fetch current profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('https://synergyproject.onrender.com/profile/view', {
          headers: { Authorization: `Bearer ${token || localStorage.getItem('authToken')}` },
        });
        const { bio, skills, location, availability, profile_picture } = response.data;
        setBio(bio || '');
        setSkills(skills?.join(', ') || '');
        setLocation(location || '');
        setAvailability(availability || '');
        setCurrentProfilePicture(profile_picture); // Set the current profile picture
      } catch (error) {
        alert('Failed to fetch profile for editing.');
      }
    };

    fetchProfile();
  }, [token]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('bio', bio);
    formData.append('skills', skills);
    formData.append('location', location);
    formData.append('availability', availability);
    if (profilePicture) {
      formData.append('profile_picture', profilePicture);
    }

    try {
      await axios.put('https://synergyproject.onrender.com/profile/update', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Profile updated successfully.');
      navigate('/profile');
    } catch (error) {
      alert('Failed to update profile.');
    }
  };

  return (
    <div className="edit-profile-container">
      <h1 className="edit-profile-title">Edit Profile</h1>
      <form className="edit-profile-form" onSubmit={handleUpdate}>
        {currentProfilePicture && (
          <div className="current-profile-picture">
            <h3>Current Profile Picture:</h3>
            <img
              src={`https://synergyproject.onrender.com/${currentProfilePicture}`}
              alt="Current Profile"
              className="profile-picture"
            />
          </div>
        )}
        <label>Bio:</label>
        <textarea
          placeholder="Enter your bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          required
        />
        <label>Skills (comma-separated):</label>
        <input
          type="text"
          placeholder="Enter your skills"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          required
        />
        <label>Location:</label>
        <input
          type="text"
          placeholder="Enter your location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
        <label>Availability:</label>
        <input
          type="text"
          placeholder="Enter your availability"
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
          required
        />
        <label>Profile Picture:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setProfilePicture(e.target.files[0])}
        />
        <button type="submit" className="save-button">Save Changes</button>
      </form>
    </div>
  );
}

export default EditProfile;
