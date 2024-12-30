import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home({ isLoggedIn, handleLogout }) {
  return (
    <div className="home-container">
      <div className="logo"></div>

      {isLoggedIn ? (
        <>
          <div className="button-row">
            <Link to="/match">
              <button className="action-button">Match</button>
            </Link>
            <Link to="/collaborations">
              <button className="action-button">View Collaborations</button>
            </Link>
            <Link to="/create-collaboration">
              <button className="action-button">Create a New Collaboration</button>
            </Link>
            <Link to="/manage-collaborations">
              <button className="action-button">Manage Collaborations</button>
            </Link>
          </div>
          <div className="button-row">
            <Link to="/creators">
              <button className="action-button">View All Creators</button>
            </Link>
          </div>
          {/* Bottom Buttons */}
          <div className="bottom-buttons">
            <Link to="/profile">
              <button className="bottom-button">View Profile</button>
            </Link>
            <Link to="/my-matches">
              <button className="bottom-button">Matches</button>
            </Link>
            <button onClick={handleLogout} className="bottom-button">
              Log Out
            </button>
          </div>
        </>
      ) : (
        <div className="auth-buttons">
          <p>You are not logged in.</p>
          <Link to="/register">
            <button className="auth-button">Register</button>
          </Link>
          <Link to="/login">
            <button className="auth-button">Login</button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Home;
