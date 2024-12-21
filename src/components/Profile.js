import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Profile({ token }) {
  const [profile, setProfile] = useState({});
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [location, setLocation] = useState('');
  const [availability, setAvailability] = useState('');

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
    fetchProfile();
  }, [token]);

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

  return (
    <div>
      <h1>Your Profile</h1>
      <pre>{JSON.stringify(profile, null, 2)}</pre>
      <form onSubmit={handleUpdate}>
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
    </div>
  );
}

export default Profile;
