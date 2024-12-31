import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CreatorsPage.css';

function CreatorsPage({ token }) {
  const [creators, setCreators] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCreatorsAndMatches = async () => {
      try {
        // Fetch creators
        const creatorsResponse = await axios.get('http://127.0.0.1:5000/profile/get_others', {
          headers: { Authorization: `Bearer ${token || localStorage.getItem('authToken')}` },
        });

        // Fetch matches
        const matchesResponse = await axios.get('http://127.0.0.1:5000/match/matches', {
          headers: { Authorization: `Bearer ${token || localStorage.getItem('authToken')}` },
        });
        const matchedUserIds = matchesResponse.data.map((match) => match.id);
        setMatches(matchedUserIds);

        // Fetch "already swiped right" status for each creator
        const creatorsWithSwipeStatus = await Promise.all(
          creatorsResponse.data.map(async (creator) => {
            const userResponse = await axios.get(`http://127.0.0.1:5000/match/get_user/${creator.id}`, {
              headers: { Authorization: `Bearer ${token || localStorage.getItem('authToken')}` },
            });
            return { ...creator, alreadySwipedRight: userResponse.data.already_swiped_right };
          })
        );

        setCreators(creatorsWithSwipeStatus);
      } catch (error) {
        console.error('Error fetching creators or matches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCreatorsAndMatches();
  }, [token]);

  const handleSwipeRight = async (userId) => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:5000/match/swipe_right/${userId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token || localStorage.getItem('authToken')}` },
        }
      );
      alert(response.data.message);
      window.location.reload(); // Refresh the page to update the list
    } catch (error) {
      console.error('Error swiping right:', error.response?.data || error.message);
      alert('Failed to swipe right. Please try again.');
    }
  };

  if (loading) {
    return <div className="loading-message">Loading creators...</div>;
  }

  if (creators.length === 0) {
    return <div className="empty-message">No creators found.</div>;
  }

  return (
    <div className="creators-container">
      <h1 className="creators-header">Creators</h1>
      <div className="creators-grid">
        {creators.map((creator) => (
          <div key={creator.id} className="creator-card">
            {creator.profile_picture ? (
              <img
                src={`http://127.0.0.1:5000/${creator.profile_picture}`}
                alt={`${creator.username}'s profile`}
                className="creator-image"
              />
            ) : (
              <div className="creator-placeholder">No Picture</div>
            )}
            <h3 className="creator-username">{creator.username}</h3>
            <p className="creator-bio">{creator.bio || 'No bio provided.'}</p>
            <p className="creator-location">Location: {creator.location || 'N/A'}</p>
            {matches.includes(creator.id) ? (
              <div className="matched-indicator">Already Matched</div>
            ) : creator.alreadySwipedRight ? (
              <div className="swiped-indicator">Already Swiped Right</div>
            ) : (
              <button
                className="swipe-right-button"
                onClick={() => handleSwipeRight(creator.id)}
              >
                Swipe Right
              </button>
            )}
            <button
              className="view-button"
              onClick={() => navigate(`/creator-info/${creator.id}`)}
            >
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CreatorsPage;
