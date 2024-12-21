import React from 'react';
import { Link } from 'react-router-dom';

function Home({ isLoggedIn, handleLogout }) {
  return (
    <div>
      <h1>Home Page</h1>
      {isLoggedIn ? (
        <>
          <p>You are logged in.</p>
          <Link to="/profile">
            <button>View Profile</button>
          </Link>
          <Link to="/match">
            <button>Match</button>
          </Link>
          <Link to="/my-matches">
            <button>My Matches</button>
          </Link>
          <button onClick={handleLogout}>Log Out</button>
        </>
      ) : (
        <>
          <p>You are not logged in.</p>
          <Link to="/register">
            <button>Register</button>
          </Link>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </>
      )}
    </div>
  );
}

export default Home;
