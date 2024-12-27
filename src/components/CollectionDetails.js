import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

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
    return <div>Loading collection details...</div>;
  }

  return (
    <div>
      <h1>Collection Details</h1>
      <ul>
        {collectionDetails.map((item) => (
          <li key={item.id}>
            <p>Type: {item.type}</p>
            <p>Content: {item.content}</p>
            {item.file_path && (
              <img src={item.file_path} alt="Collection Item" style={{ maxWidth: '200px' }} />
            )}
          </li>
        ))}
      </ul>
      <button onClick={() => navigate('/match', { state: { currentIndex } })}>
        Go Back to Match Page
      </button>
    </div>
  );
}

export default CollectionDetails;
