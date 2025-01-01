import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Likes.css';

function Likes({ token }) {
  const [likedUsers, setLikedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLikedUsers = async () => {
      try {
        const response = await axios.get('https://synergyproject.onrender.com/match/likes', {
          headers: { Authorization: `Bearer ${token || localStorage.getItem('authToken')}` },
        });
        setLikedUsers(response.data);
      } catch (error) {
        console.error('Error fetching liked users:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedUsers();
  }, [token]);

  const handleSwipeRight = async (userId) => {
    try {
      const response = await axios.post(
        `https://synergyproject.onrender.com/match/swipe_right/${userId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token || localStorage.getItem('authToken')}` },
        }
      );
      alert(response.data.message);
      window.location.reload(); // Refresh the page after a successful swipe
    } catch (error) {
      console.error('Error swiping right:', error.response?.data || error.message);
      alert('Failed to swipe right. Please try again.');
    }
  };

  if (loading) {
    return <div className="loading-message">Loading liked users...</div>;
  }

  if (likedUsers.length === 0) {
    return <div className="empty-message">No one has liked you yet.</div>;
  }

  return (
    <div className="liked-container">
      <h1 className="liked-header">People Who Liked You</h1>
      <div className="liked-grid">
        {likedUsers.map((user) => (
          <div key={user.id} className="liked-card">
            {user.profile_picture ? (
              <img
                src={`https://synergyproject.onrender.com/${user.profile_picture}`}
                alt={`${user.username}'s profile`}
                className="liked-image"
              />
            ) : (
              <div className="liked-placeholder">No Picture</div>
            )}
            <h3 className="liked-username">{user.username}</h3>
            <p className="liked-bio">{user.bio || 'No bio provided.'}</p>
            <p className="liked-location">Location: {user.location || 'N/A'}</p>
            <div className="button-container">
              <button
                className="view-button"
                onClick={() => navigate(`/creator-info/${user.id}`)}
              >
                View
              </button>
              <button
                className="swipe-right-button"
                onClick={() => handleSwipeRight(user.id)}
              >
                Swipe Right
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Likes;
