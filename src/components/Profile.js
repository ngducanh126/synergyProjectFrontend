import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';

function Profile({ token }) {
  const [profile, setProfile] = useState({});
  const [collections, setCollections] = useState([]);
  const [collaborations, setCollaborations] = useState([]);
  const navigate = useNavigate();

  // Fetch profile and collections
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/profile/view', {
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

  return (
    <div className="profile-container">
      {/* Logo */}
      <header className="logo-container">
        <h1 className="logo">Synergy</h1>
      </header>

      {/* Profile Section */}
      <div className="profile-section">
        {/* Profile Picture */}
        <div className="profile-picture-container">
          {profile.profile_picture ? (
            <img
              src={`http://127.0.0.1:5000/${profile.profile_picture}`}
              alt="Profile"
              className="profile-picture"
            />
          ) : (
            <div className="default-profile-picture" />
          )}
          <h2 className="username">{profile.username || 'Username'}</h2>
        </div>

        {/* Bio and Location */}
        <div className="bio-location">
          <p className="bio">{profile.bio || 'No bio provided'}</p>
          <p className="location">{profile.location || 'No location provided'}</p>
        </div>

        {/* Edit Profile Button */}
        <button
          className="edit-profile-button"
          onClick={() => navigate('/profile/edit')}
        >
          Edit Profile
        </button>
      </div>

      {/* Skills and Collaborations */}
      <div className="details-section">
        {/* Skills */}
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

        {/* Collaborations */}
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
    </div>
  );
}

export default Profile;
