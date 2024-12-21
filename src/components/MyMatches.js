import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MyMatches({ token }) {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/match/matches', {
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
    <div>
      <h1>My Matches</h1>
      {matches.length > 0 ? (
        <ul>
          {matches.map((match) => (
            <li key={match.id}>
              <h2>{match.username}</h2>
              <p>{match.bio}</p>
              <p>Skills: {match.skills?.join(', ')}</p>
              <p>Location: {match.location}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No matches yet!</p>
      )}
    </div>
  );
}

export default MyMatches;
