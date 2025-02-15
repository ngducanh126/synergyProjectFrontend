import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import './ChatPage.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function ChatPage({ token }) {
  const { receiverId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);

  const room = `room-${Math.min(
    receiverId,
    getSenderIdFromToken(token)
  )}-${Math.max(receiverId, getSenderIdFromToken(token))}`;

  useEffect(() => {
    const newSocket = io(`${API_BASE_URL}`, {
      extraHeaders: {
        Authorization: `Bearer ${token}`, // Pass the token in headers
      },
    });
    setSocket(newSocket);

    newSocket.emit('join', { room });

    newSocket.on('message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      newSocket.emit('leave', { room });
      newSocket.disconnect();
    };
  }, [room, token]);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/chat/history/${receiverId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMessages(response.data);
      } catch (error) {
        alert('Failed to load chat history.');
      }
    };
    fetchChatHistory();
  }, [receiverId, token]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (socket && newMessage.trim()) {
      const messageData = {
        sender_id: getSenderIdFromToken(token),
        receiver_id: receiverId,
        room,
        message: newMessage.trim(),
      };
      socket.emit('message', messageData);
      setNewMessage('');
    }
  };

  return (
    <div className="chat-container">
      <header className="chat-header">Chat with User {receiverId}</header>
      <div className="chat-history">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${
              msg.sender_id === Number(receiverId) ? 'received' : 'sent'
            }`}
          >
            <p className="chat-text">{msg.message}</p>
            <small className="chat-timestamp">
              {new Date(msg.timestamp).toLocaleString()}
            </small>
          </div>
        ))}
      </div>
      <form className="chat-form" onSubmit={handleSendMessage}>
        <input
          className="chat-input"
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button className="chat-send-button" type="submit">
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatPage;

function getSenderIdFromToken(token) {
  const payload = JSON.parse(atob(token.split('.')[1]));
  return parseInt(payload.sub, 10); // Ensure sender ID is a number
}
