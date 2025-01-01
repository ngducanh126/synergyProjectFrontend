import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './MatchPage.css';

function Match({ token }) {
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [collections, setCollections] = useState([]);
  const [collaborations, setCollaborations] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const collaborationId = queryParams.get('collaboration_id');

  // Fetch profiles
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get('https://synergyproject.onrender.com/match/get_others', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: collaborationId ? { collaboration_id: collaborationId } : {},
        });
        setProfiles(response.data);
      } catch (error) {
        console.error('Failed to load profiles:', error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [token, collaborationId]);

  // Fetch collections for the current profile
  useEffect(() => {
    const fetchCollections = async () => {
      if (profiles.length > 0 && profiles[currentIndex]) {
        try {
          const response = await axios.get(
            `https://synergyproject.onrender.com/profile/${profiles[currentIndex].id}/collections`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setCollections(response.data);
        } catch (error) {
          console.error('Failed to load collections:', error.response?.data?.message || error.message);
          setCollections([]);
        }
      }
    };

    fetchCollections();
  }, [profiles, currentIndex, token]);

  // Fetch collaborations for the current profile
  useEffect(() => {
    const fetchCollaborations = async () => {
      if (profiles.length > 0 && profiles[currentIndex]) {
        try {
          const response = await axios.get(
            `https://synergyproject.onrender.com/match/get_user_collaborations/${profiles[currentIndex].id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setCollaborations(response.data.collaborations || []);
        } catch (error) {
          console.error('Failed to load collaborations:', error.response?.data?.message || error.message);
          setCollaborations([]);
        }
      }
    };

    fetchCollaborations();
  }, [profiles, currentIndex, token]);

  const handleSwipeRight = async (userId) => {
    try {
      const response = await axios.post(
        `https://synergyproject.onrender.com/match/swipe_right/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.is_match) {
        alert(`It's a match with ${profiles[currentIndex].username}!`);
      } else {
        alert('Swiped right successfully.');
      }

      setCurrentIndex((prevIndex) => prevIndex + 1);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to swipe right');
    }
  };

  const handleSwipeLeft = () => {
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  if (loading) {
    return <div>Loading profiles...</div>;
  }

  if (profiles.length === 0) {
    return <div>No profiles found to swipe!</div>;
  }

  if (currentIndex >= profiles.length) {
    return <div>No more profiles to swipe!</div>;
  }

  const currentProfile = profiles[currentIndex];

  return (
    <div className="match-container">
      <h1 className="match-title">Match Page</h1>
      {currentProfile && (
        <div className="profile-card">
          {currentProfile.profile_picture ? (
            <img
              src={`https://synergyproject.onrender.com/${currentProfile.profile_picture}`}
              alt={`${currentProfile.username}'s profile`}
              className="profile-picture"
            />
          ) : (
            <div className="profile-placeholder">No Picture</div>
          )}
          <h2 className="profile-username">{currentProfile.username}</h2>
          <p className="profile-info">Bio: {currentProfile.bio || 'N/A'}</p>
          <p className="profile-info">Location: {currentProfile.location || 'N/A'}</p>
          <p className="profile-info">Availability: {currentProfile.availability || 'N/A'}</p>

          <div className="profile-details">
            <div className="skills-section">
              <h3>SkillSet</h3>
              <ul>
                {currentProfile.skills?.length > 0
                  ? currentProfile.skills.map((skill, index) => <li key={index}>{skill}</li>)
                  : 'N/A'}
              </ul>
            </div>
            <div className="collaborations-section">
              <h3>Collaborations</h3>
              <ul>
                {collaborations.length > 0
                  ? collaborations.map((collab) => <li key={collab.id}>{collab.name}</li>)
                  : 'N/A'}
              </ul>
            </div>
          </div>

          <div className="portfolio-section">
            <h2>Portfolio</h2>
            <div className="portfolio-grid">
              {collections.map((collection) => (
                <div className="collection-card" key={collection.id}>
                  <h3 className="collection-name">{collection.name}</h3>
                  <button
                    className="view-collection-button"
                    onClick={() =>
                      navigate(`/collectioninfo/${collection.id}`, {
                        state: { currentIndex },
                      })
                    }
                  >
                    View Collection
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="swipe-buttons">
            <button className="swipe-button" onClick={handleSwipeLeft}>
              Swipe Left
            </button>
            <button
              className="swipe-button"
              onClick={() => handleSwipeRight(currentProfile.id)}
            >
              Swipe Right
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Match;
