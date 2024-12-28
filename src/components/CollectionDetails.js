import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './CollectionStyles.css'; // Import the shared CSS file

function CollectionDetails({ token }) {
  const [collectionDetails, setCollectionDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { collectionId, currentIndex } = location.state;

  useEffect(() => {
    const fetchCollectionDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/collections/${collectionId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCollectionDetails(response.data);
      } catch (error) {
        console.error('Failed to load collection details', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollectionDetails();
  }, [collectionId, token]);

  if (loading) {
    return <div className="loading-message">Loading collection details...</div>;
  }

  return (
    <div className="collection-container">
      <h1 className="collection-header">Collection Details</h1>
      <button
        className="go-back-button"
        onClick={() => navigate('/match', { state: { currentIndex } })}
      >
        Go Back to Match Page
      </button>
      {collectionDetails.length === 0 ? (
        <p className="empty-state">No items in this collection.</p>
      ) : (
        <ul className="collection-list">
          {collectionDetails.map((item) => (
            <li key={item.id} className="collection-item">
              <p>Type: {item.type}</p>
              <p>Content: {item.content}</p>
              {item.file_path && (
                <img src={item.file_path} alt="Collection Item" className="collection-item-image" />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CollectionDetails;
