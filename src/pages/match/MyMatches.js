import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './MyMatchesPage.css'; 

function MyMatches({ token }) {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get('https://synergyproject.onrender.com/match/matches', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMatches(response.data);
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to load matches');
      }
    };

    fetchMatches();
  }, [token]);


  return (
    <div className="matches-container">
        <h1 className="matches-title">My Matches</h1>
        {matches.length > 0 ? (
            <div className="matches-list">
                {matches.map((match) => (
                    <div className="match-card" key={match.id}>
                        <h2 className="match-username">{match.username}</h2>
                        <p className="match-info">{match.bio}</p>
                        <p className="match-info">Skills: {match.skills?.join(', ')}</p>
                        <p className="match-info">Location: {match.location}</p>
                        <Link to={`/chat/${match.id}`}>
                            <button className="chat-button">Chat Now</button>
                        </Link>
                    </div>
                ))}
            </div>
        ) : (
            <p>No matches yet!</p>
        )}
    </div>
);


}

export default MyMatches;
