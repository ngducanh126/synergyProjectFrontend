import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CreatorsPage.css';

function CreatorsPage({ token }) {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/match/get_others', {
          headers: { Authorization: `Bearer ${token || localStorage.getItem('authToken')}` },
        });
        setCreators(response.data);
      } catch (error) {
        console.error('Error fetching creators:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCreators();
  }, [token]);

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
            {/* Conditionally render profile picture */}
            {creator.profile_picture ? (
              <img
                src={`http://127.0.0.1:5000/${creator.profile_picture}`} // Prepend base URL
                alt={`${creator.username}'s profile`}
                className="creator-image"
              />
            ) : (
              <div className="creator-placeholder">No Picture</div>
            )}
            <h3 className="creator-username">{creator.username}</h3>
            <p className="creator-bio">{creator.bio || 'No bio provided.'}</p>
            <p className="creator-location">Location: {creator.location || 'N/A'}</p>
            {creator.skills && <p className="creator-skills">Skills: {creator.skills}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CreatorsPage;
