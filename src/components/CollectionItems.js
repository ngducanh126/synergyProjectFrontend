import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';  // Import useNavigate and useParams

function CollectionItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { collectionId, userId } = useParams();  // Access collectionId and userId from URL params
  const navigate = useNavigate(); // Use navigate here to go back to the match page

  useEffect(() => {
    const fetchCollectionItems = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/profile/collections/${userId}/${collectionId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,  // Or get token from context
          },
        });
        setItems(response.data);
      } catch (error) {
        console.error(error.response?.data?.message || 'Failed to load items');
      } finally {
        setLoading(false);
      }
    };

    fetchCollectionItems();
  }, [collectionId, userId]);

  const handleGoBack = () => {
    navigate('/match');  // Use navigate instead of history.push to go back to the match page
  };

  if (loading) {
    return <div>Loading items...</div>;
  }

  return (
    <div>
      <h1>Collection Items</h1>
      <button onClick={handleGoBack}>Go Back</button>

      {items.length === 0 ? (
        <p>No items in this collection.</p>
      ) : (
        <div>
          {items.map((item) => (
            <div key={item.id}>
              <h3>{item.type}</h3>
              <p>{item.content}</p>
              {item.file_path && <img src={item.file_path} alt="item" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CollectionItems;
