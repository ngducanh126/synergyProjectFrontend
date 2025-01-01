import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './CollectionStyles.css';

function CollectionPage({ token }) {
  const { collectionId } = useParams();
  const [items, setItems] = useState([]);
  const [itemType, setItemType] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);

  // Fetch items on component mount
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(
          `https://synergyproject.onrender.com/profile/collections/${collectionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setItems(response.data);
      } catch (error) {
        alert('Failed to fetch items.');
      }
    };
    fetchItems();
  }, [collectionId, token]);

  // Add new item logic
  const handleAddItem = async (e) => {
    e.preventDefault();

    // Validation
    if (!file) {
      alert('Please select a valid file.');
      return;
    }
    if (!content.trim()) {
      alert('Please provide a description.');
      return;
    }

    const formData = new FormData();
    formData.append('type', itemType);
    formData.append('content', content);
    formData.append('file', file);

    try {
      await axios.post(
        `https://synergyproject.onrender.com/profile/collections/${collectionId}/items`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Refresh the page after adding an item
      window.location.reload();
    } catch (error) {
      alert('Failed to add item.');
    }
  };

  return (
    <div className="collection-container">
      <h1 className="collection-header">Collection Items</h1>
      <div className="collection-grid">
        {items.length === 0 ? (
          <p className="empty-collection-message">No items in this collection. Add some items to get started!</p>
        ) : (
          items.map((item, index) => (
            <div key={index} className="collection-card">
              {item.file_path && (
                <>
                  {item.type === 'image' && (
                    <img
                      src={item.file_path}
                      alt="Uploaded content"
                      className="collection-card-image"
                    />
                  )}
                  {item.type === 'video' && (
                    <video
                      src={item.file_path}
                      controls
                      className="collection-card-video"
                    ></video>
                  )}
                </>
              )}
              <p>{item.content}</p>
            </div>
          ))
        )}
      </div>

      <form className="add-item-form" onSubmit={handleAddItem}>
        <h2 className="add-item-header">Add Item</h2>
        <select
          value={itemType}
          onChange={(e) => setItemType(e.target.value)}
          required
          className="add-item-select"
        >
          <option value="" disabled>
            Select Type
          </option>
          <option value="image">Image</option>
          <option value="video">Video</option>
        </select>
        <input
          type="file"
          accept={itemType === 'image' ? 'image/*' : 'video/*'}
          onChange={(e) => setFile(e.target.files[0])}
          required
          className="add-item-file"
        />
        <input
          type="text"
          placeholder="Add description"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="add-item-input"
        />
        <button type="submit" className="add-item-button">
          Add Item
        </button>
      </form>
    </div>
  );
}

export default CollectionPage;
