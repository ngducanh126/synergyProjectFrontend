import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './CreatorInfo.css';

function CreatorInfo({ token }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMatched, setIsMatched] = useState(false);
  const [alreadySwiped, setAlreadySwiped] = useState(false);
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    const fetchCreatorInfo = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/match/get_user/${id}`, {
          headers: { Authorization: `Bearer ${token || localStorage.getItem('authToken')}` },
        });
        setCreator(response.data);

        // Check if the current user is matched with this creator
        const matchesResponse = await axios.get('http://127.0.0.1:5000/match/matches', {
          headers: { Authorization: `Bearer ${token || localStorage.getItem('authToken')}` },
        });
        const matchedUserIds = matchesResponse.data.map((match) => match.id);
        setIsMatched(matchedUserIds.includes(Number(id)));

        // Check if the current user has already swiped right on this creator
        if (response.data.already_swiped_right) {
          setAlreadySwiped(true);
        }

        // Fetch collections for the creator
        const collectionsResponse = await axios.get(`http://127.0.0.1:5000/profile/${id}/collections`, {
          headers: { Authorization: `Bearer ${token || localStorage.getItem('authToken')}` },
        });
        setCollections(collectionsResponse.data);
      } catch (error) {
        console.error('Error fetching creator info:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCreatorInfo();
  }, [id, token]);

  const handleSwipeRight = async () => {
    try {
      await axios.post(`http://127.0.0.1:5000/match/swipe_right/${id}`, null, {
        headers: { Authorization: `Bearer ${token || localStorage.getItem('authToken')}` },
      });
      alert('You swiped right!');
      window.location.reload(); // Refresh the page
    } catch (error) {
      console.error('Error swiping right:', error.response?.data || error.message);
    }
  };

  if (loading) {
    return <div className="loading-message">Loading creator info...</div>;
  }

  if (!creator) {
    return <div className="error-message">Creator not found.</div>;
  }

  return (
    <div className="creator-info-container">
      <div className="profile-card">
        {creator.profile_picture ? (
          <img
            src={`http://127.0.0.1:5000/${creator.profile_picture}`}
            alt={`${creator.username}'s profile`}
            className="profile-picture"
          />
        ) : (
          <div className="profile-placeholder">No Picture</div>
        )}
        <h2 className="profile-username">{creator.username}</h2>
        <p className="profile-info">Bio: {creator.bio || 'N/A'}</p>
        <p className="profile-info">Location: {creator.location || 'N/A'}</p>
        <p className="profile-info">Availability: {creator.availability || 'N/A'}</p>

        <div className="profile-details">
          <div className="skills-section">
            <h3>SkillSet</h3>
            <ul>
              {Array.isArray(creator.skills) && creator.skills.length > 0 ? (
                creator.skills.map((skill, index) => <li key={index}>{skill}</li>)
              ) : (
                <p>N/A</p>
              )}
            </ul>
          </div>
        </div>

        <div className="portfolio-section">
          <h2>Portfolio</h2>
          <div className="portfolio-grid">
            {collections.map((collection, index) => (
              <div className="collection-card" key={collection.id}>
                <h3 className="collection-name">{collection.name}</h3>
                <button
                  className="view-collection-button"
                  onClick={() =>
                    navigate(`/collectioninfo/${collection.id}`, {
                      state: { currentIndex: index },
                    })
                  }
                >
                  View Collection
                </button>
              </div>
            ))}
          </div>
        </div>

        {isMatched ? (
          <div className="matched-indicator">You are already matched!</div>
        ) : alreadySwiped ? (
          <div className="swiped-indicator">You already swiped right!</div>
        ) : (
          <button className="swipe-right-button" onClick={handleSwipeRight}>
            Swipe Right
          </button>
        )}
      </div>
    </div>
  );
}

export default CreatorInfo;
