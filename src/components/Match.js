import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MatchPage.css'; // Import the CSS file

function Match({ token }) {
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch all other user profiles
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/match/get_others', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Fetched profiles:", response.data); // Debugging log
        setProfiles(response.data);
      } catch (error) {
        console.error(error.response?.data?.message || 'Failed to load profiles');
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [token]);

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

      // Move to the next profile
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to swipe right');
    }
  };

  const handleSwipeLeft = () => {
    // Move to the next profile without doing anything
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
                <h2 className="profile-username">{currentProfile.username}</h2>
                <p className="profile-info">{currentProfile.bio}</p>
                <p className="profile-info">Skills: {currentProfile.skills?.join(', ')}</p>
                <p className="profile-info">Location: {currentProfile.location}</p>
                <button className="swipe-button" onClick={handleSwipeLeft}>Swipe Left</button>
                <button className="swipe-button" onClick={() => handleSwipeRight(currentProfile.id)}>Swipe Right</button>
            </div>
        )}
    </div>
);

}

export default Match;
