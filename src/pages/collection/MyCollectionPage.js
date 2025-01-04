import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function MyCollectionPage({ token }) {
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
                `${API_BASE_URL}/profile/collections/${collectionId}`,
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

  // Handle adding a new item
  const handleAddItem = async (e) => {
    e.preventDefault();
    console.log(
      `[DEBUG] Adding item to Collection ID: ${collectionId}, Type: ${itemType}, Content: ${content}, File: ${file?.name || 'None'}`
    );
  
    try {
      let response;
  
      if (itemType === 'text') {
        console.log('[DEBUG] Sending text content...');
        console.log('[DEBUG] Payload:', { type: itemType, content });
  
        response = await axios.post(
          `${API_BASE_URL}/profile/collections/${collectionId}/items`,
          { type: itemType, content },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
      } else {
        console.log('[DEBUG] Sending image or video with description...');
        if (!file) {
          console.warn('[WARNING] No file selected for upload.');
          alert('Please select a valid file.');
          return;
        }
        if (!content.trim()) {
          console.warn('[WARNING] No description provided for the file.');
          alert('Please add a description.');
          return;
        }
  
        const formData = new FormData();
        formData.append('type', itemType);
        formData.append('content', content);
        formData.append('file', file);
        console.log('[DEBUG] FormData created:');
        console.log(`[DEBUG] type: ${itemType}, content: ${content}, file: ${file.name}`);
  
        response = await axios.post(
          `${API_BASE_URL}/profile/collections/${collectionId}/items`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
  
      console.log('[DEBUG] Item added successfully:', response.data);
  
      setItems((prevItems) => [
        ...prevItems,
        {
          id: response.data.id || Date.now(), // Use backend ID or fallback
          type: itemType,
          content: content,
          file_path: response.data.file_path, // Add the new file path directly
        },
      ]);
  
      if (file) {
        console.log('[DEBUG] Revoking object URL for file.');
        URL.revokeObjectURL(file); // Only revoke if `URL.createObjectURL` was used
      }
  
      setItemType('');
      setContent('');
      setFile(null);
      console.log('[DEBUG] Form fields reset after successful item addition.');

      // Reload the page after adding the item
      window.location.reload(); // This forces the page to reload
    } catch (error) {
      console.error('[ERROR] Failed to add item:', error.response?.data || error.message);
      alert('Failed to add item.');
    }
  };

  return (
    <div>
      <h1>Collection Items</h1>
      <ul>
        {items.map((item, index) => (
          <li key={item.id || index} className={item.isNew ? 'new-item' : ''}>
            <p>Type: {item.type}</p>
            {item.type === 'image' && item.file_path && (
            <>
                <img
                src={item.file_path} // Use backend-provided path
                alt="Uploaded content"
                style={{ maxWidth: '200px' }}
                />
                <p>Description: {item.content}</p>
            </>
            )}
            {item.type === 'video' && item.file_path && (
            <>
                <video
                src={item.file_path} // Use backend-provided file path
                controls
                style={{ maxWidth: '400px', marginBottom: '10px' }} // Adjust size as needed
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

      <form onSubmit={handleAddItem}>
        <h2>Add Item</h2>
        <select
          value={itemType}
          onChange={(e) => setItemType(e.target.value)}
          required
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
          />
        )}
        {(itemType === 'image' || itemType === 'video') && (
          <>
            <input
              type="file"
              accept={itemType === 'image' ? 'image/*' : 'video/*'}
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
            <input
              type="text"
              placeholder="Add description"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </>
        )}
        <button type="submit">
          {itemType === 'text' ? 'Add Item' : 'Add Item with Description'}
        </button>
      </form>
    </div>
  );
}

export default MyCollectionPage;
