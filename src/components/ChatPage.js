import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ChatPage = () => {
    const { otherUserId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        // Fetch messages with the other user
        const fetchMessages = async () => {
            const token = localStorage.getItem('token');
            const response = await axios.get(`/chat/messages/${otherUserId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setMessages(response.data);
        };
        fetchMessages();
    }, [otherUserId]);

    const sendMessage = async () => {
        const token = localStorage.getItem('token');
        await axios.post(
            `/chat/messages/${otherUserId}`,
            { message: newMessage },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        setNewMessage('');
        const updatedMessages = await axios.get(`/chat/messages/${otherUserId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setMessages(updatedMessages.data);
    };

    return (
        <div>
            <h2>Chat with User {otherUserId}</h2>
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index} className={msg.sender_id === parseInt(localStorage.getItem('user_id')) ? 'my-message' : 'their-message'}>
                        <p>{msg.message}</p>
                        <span>{new Date(msg.timestamp).toLocaleString()}</span>
                    </div>
                ))}
            </div>
            <div className="message-input">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatPage;
