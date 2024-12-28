import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './MatchPage.css';

function Match({ token }) {
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [collections, setCollections] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const collaborationId = queryParams.get('collaboration_id');

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/match/get_others', {
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

  useEffect(() => {
    const fetchCollections = async () => {
      if (profiles.length > 0 && profiles[currentIndex]) {
        try {
          const response = await axios.get(
            `http://127.0.0.1:5000/profile/${profiles[currentIndex].id}/collections`,
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

  const handleSwipeRight = async (userId) => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:5000/match/swipe_right/${userId}`,
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
          {currentProfile.profile_picture && (
            <img
              src={currentProfile.profile_picture}
              alt={`${currentProfile.username}'s profile`}
              className="profile-picture"
            />
          )}
          <h2 className="profile-username">{currentProfile.username}</h2>
          {currentProfile.bio && <p className="profile-info">{currentProfile.bio}</p>}
          {currentProfile.skills?.length > 0 && (
            <p className="profile-info">Skills: {currentProfile.skills.join(', ')}</p>
          )}
          {currentProfile.location && (
            <p className="profile-info">Location: {currentProfile.location}</p>
          )}
          {collections.length > 0 ? (
            <div className="collections">
              <h2 className="collections-title">Collections:</h2>
              <div className="collection-grid">
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

          ) : (
            <p>No collections available for this user.</p>
          )}
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
      )}
    </div>
  );
}

export default Match;
