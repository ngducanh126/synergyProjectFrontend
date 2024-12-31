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
        const response = await axios.get('http://127.0.0.1:5000/match/likes', {
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
                src={`http://127.0.0.1:5000/${user.profile_picture}`}
                alt={`${user.username}'s profile`}
                className="liked-image"
              />
            ) : (
              <div className="liked-placeholder">No Picture</div>
            )}
            <h3 className="liked-username">{user.username}</h3>
            <p className="liked-bio">{user.bio || 'No bio provided.'}</p>
            <p className="liked-location">Location: {user.location || 'N/A'}</p>
            <button
              className="view-button"
              onClick={() => navigate(`/creator-info/${user.id}`)}
            >
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Likes;
