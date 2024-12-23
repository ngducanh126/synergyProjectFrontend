import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function CollectionPage({ token }) {
  const { collectionId } = useParams();
  const [items, setItems] = useState([]);
  const [itemType, setItemType] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);

  // Fetch items for the collection
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

        // Map the items to ensure file_path URLs are consistent
        const updatedItems = response.data.map((item) => ({
          ...item,
          file_path: item.file_path || null, // Ensure the backend provides complete URLs
        }));

        setItems(updatedItems);
        console.log('[DEBUG] Updated items for frontend:', updatedItems);
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
        console.log('[DEBUG] Sending image or video with description...');
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
        console.log(`[DEBUG] File attached: ${file.name}`);

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

      console.log('[DEBUG] Item added successfully:', response.data);

      setItems((prevItems) => [
        ...prevItems,
        {
          id: response.data.id || Date.now(), // Use backend ID or fallback
          type: itemType,
          content: content,
          file_path: response.data.file_path, // Use file_path from backend
        },
      ]);
      
      if (file) URL.revokeObjectURL(file); // Only revoke if `URL.createObjectURL` was used
      

      if (file) URL.revokeObjectURL(file); // Clean up the object URL
      setItemType('');
      setContent('');
      setFile(null);
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
          <li key={item.id || index}>
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
                src={item.file_path} // Use backend-provided path
                controls
                style={{ maxWidth: '200px' }}
                />
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

export default CollectionPage;
