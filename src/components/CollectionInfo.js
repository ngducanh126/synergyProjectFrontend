import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import './CollectionStyles.css';

function CollectionInfo({ token }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { collectionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentIndex } = location.state;

  useEffect(() => {
    const fetchCollectionItems = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/profile/collections/${collectionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setItems(response.data);
      } catch (error) {
        console.error('Failed to load collection items:', error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCollectionItems();
  }, [collectionId, token]);

  if (loading) {
    return <div className="loading-message">Loading collection details...</div>;
  }

  return (
    <div className="collection-container">
      <h1 className="collection-header">Collection Info</h1>
      <div className="collection-grid">
        {items.length === 0 ? (
          <p className="empty-collection-message">No items in this collection.</p>
        ) : (
          items.map((item, index) => (
            <div key={index} className="collection-card">
              {item.file_path && (
                <>
                  {item.file_path.endsWith('.mp4') || item.file_path.endsWith('.webm') ? (
                    <video
                      src={item.file_path}
                      controls
                      className="collection-card-video"
                    ></video>
                  ) : (
                    <img
                      src={item.file_path}
                      alt="Collection Item"
                      className="collection-card-image"
                    />
                  )}
                </>
              )}
              <p>{item.content}</p>
            </div>
          ))
        )}
      </div>
      <button
        className="go-back-button"
        onClick={() => navigate('/match', { state: { currentIndex } })}
      >
        Go Back to Match Page
      </button>
    </div>
  );
}

export default CollectionInfo;
