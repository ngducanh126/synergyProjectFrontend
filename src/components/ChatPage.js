import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';

function ChatPage({ token }) {
  const { receiverId } = useParams(); // Extract receiver ID from the route
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);

  // Compute room name once
  const room = `room-${Math.min(receiverId, getSenderIdFromToken(token))}-${Math.max(receiverId, getSenderIdFromToken(token))}`;

  // WebSocket connection
  useEffect(() => {
    console.log('[DEBUG] Initializing WebSocket connection...');
    const newSocket = io('http://127.0.0.1:5000', {
      query: { token },
    });
    setSocket(newSocket);

    console.log(`[DEBUG] Joining room: ${room}`);
    newSocket.emit('join', { room });

    newSocket.on('message', (message) => {
      console.log('[DEBUG] Received message:', message);
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      console.log(`[DEBUG] Leaving room: ${room}`);
      newSocket.emit('leave', { room });
      newSocket.disconnect();
    };
  }, [room, token]); // Add `room` and `token` as dependencies

  // Fetch chat history
  useEffect(() => {
    const fetchChatHistory = async () => {
      console.log('[DEBUG] Fetching chat history for Receiver ID:', receiverId);
      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/chat/history/${receiverId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in headers
            },
          }
        );
        console.log('[DEBUG] Chat history fetched:', response.data);
        setMessages(response.data);
      } catch (error) {
        console.error('[ERROR] Failed to load chat history:', error.response?.data || error.message);
        alert('Failed to load chat history.');
      }
    };
    fetchChatHistory();
  }, [receiverId, token]);

  // Send a new message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (socket && newMessage.trim()) {
      const messageData = {
        sender_id: getSenderIdFromToken(token), // Decode the token to get sender ID
        receiver_id: receiverId,
        room,
        message: newMessage.trim(),
      };
      console.log('[DEBUG] Sending message:', messageData);
      socket.emit('message', messageData);
      setNewMessage(''); // Clear input field
    }
  };

  return (
    <div>
      <h1>Chat with User {receiverId}</h1>
      <div className="chat-history">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender_id === receiverId ? 'received' : 'sent'}`}>
            <p>{msg.message}</p>
            <small>{new Date(msg.timestamp).toLocaleString()}</small>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default ChatPage;

// Helper function to decode JWT token
function getSenderIdFromToken(token) {
  const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
  return payload.sub; // Assuming 'sub' contains the sender ID
}
