import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './CollectionStyles.css'; // Import shared CSS file

function CollectionPage({ token }) {
  const { collectionId } = useParams();
  const [items, setItems] = useState([]);
  const [itemType, setItemType] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      console.log(`[DEBUG] Fetching items for Collection ID: ${collectionId}`);
      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/profile/collections/${collectionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log('[DEBUG] Items fetched from backend:', response.data);

        const updatedItems = response.data.map((item) => ({
          ...item,
          file_path: item.file_path || null,
        }));

        console.log('[DEBUG] Processed items with file paths:', updatedItems);
        setItems(updatedItems);
      } catch (error) {
        console.error('[ERROR] Failed to fetch items:', error.response?.data || error.message);
        alert('Failed to fetch items.');
      }
    };
    fetchItems();
  }, [collectionId, token]);

  const handleAddItem = async (e) => {
    e.preventDefault();
    console.log(
      `[DEBUG] Adding item to Collection ID: ${collectionId}, Type: ${itemType}, Content: ${content}, File: ${file?.name || 'None'}`
    );

    try {
      let response;

      if (itemType === 'text') {
        response = await axios.post(
          `http://127.0.0.1:5000/profile/collections/${collectionId}/items`,
          { type: itemType, content },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
      } else {
        if (!file) {
          alert('Please select a valid file.');
          return;
        }
        if (!content.trim()) {
          alert('Please add a description.');
          return;
        }

        const formData = new FormData();
        formData.append('type', itemType);
        formData.append('content', content);
        formData.append('file', file);

        response = await axios.post(
          `http://127.0.0.1:5000/profile/collections/${collectionId}/items`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      setItems((prevItems) => [
        ...prevItems,
        {
          id: response.data.id || Date.now(),
          type: itemType,
          content: content,
          file_path: response.data.file_path,
        },
      ]);

      setItemType('');
      setContent('');
      setFile(null);
      window.location.reload(); // Reload page to refresh data
    } catch (error) {
      console.error('[ERROR] Failed to add item:', error.response?.data || error.message);
      alert('Failed to add item.');
    }
  };

  return (
    <div className="collection-container">
      <h1 className="collection-header">Collection Items</h1>
      <ul className="collection-list">
        {items.map((item, index) => (
          <li key={item.id || index} className="collection-item">
            <p>Type: {item.type}</p>
            {item.type === 'image' && item.file_path && (
              <>
                <img
                  src={item.file_path}
                  alt="Uploaded content"
                  className="collection-item-image"
                />
                <p>Description: {item.content}</p>
              </>
            )}
            {item.type === 'video' && item.file_path && (
              <>
                <video
                  src={item.file_path}
                  controls
                  className="collection-item-video"
                >
                  Your browser does not support the video tag.
                </video>
                <p>Description: {item.content}</p>
              </>
            )}
            {item.type === 'text' && <p>Content: {item.content}</p>}
          </li>
        ))}
      </ul>

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
          <option value="text">Text</option>
          <option value="image">Image</option>
          <option value="video">Video</option>
        </select>
        {itemType === 'text' && (
          <input
            type="text"
            placeholder="Enter text content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="add-item-input"
          />
        )}
        {(itemType === 'image' || itemType === 'video') && (
          <>
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
          </>
        )}
        <button type="submit" className="add-item-button">
          {itemType === 'text' ? 'Add Item' : 'Add Item with Description'}
        </button>
      </form>
    </div>
  );
}

export default CollectionPage;
