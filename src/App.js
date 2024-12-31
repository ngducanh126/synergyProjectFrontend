import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import Match from './components/Match';
import MyMatches from './components/MyMatches';
import ChatPage from './components/ChatPage';
import CollectionPage from './components/CollectionPage';
import CollectionInfo from './components/CollectionInfo';
import CollaborationsPage from './components/CollaborationsPage';
import CollaborationDetailsPage from './components/CollaborationDetailsPage';
import MyOwnCollaborationsPage from './components/MyOwnCollaborationsPage';
import MyCollabRequestsPage from './components/MyCollabRequestsPage';
import ApproveCollabRequestsPage from './components/ApproveCollabRequestsPage';
import JoinedCollaborationsPage from './components/JoinedCollaborationsPage';
import CreateCollaborationPage from './components/CreateCollaborationPage';
import EditProfile from './components/EditProfile';
import ManageCollaborations from './components/MangeCollaborations';
import CreatorsPage from './components/CreatorsPage';
import EditCollaborationPage from './components/EditCollaborationPage';
import CreatorInfo from './components/CreatorInfo';
import Likes from './components/Likes';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
    }
    setLoading(false); // Done loading token from localStorage
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setToken('');
    setIsLoggedIn(false);
  };

  if (loading) {
    // Display a loading spinner or message while token is being checked
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <Home isLoggedIn={isLoggedIn} handleLogout={handleLogout} token={token} />
          }
        />
        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} setToken={setToken} />}
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/profile"
          element={
            isLoggedIn ? (
              <Profile token={token} />
            ) : (
              <div>Please log in first.</div>
            )
          }
        />
        <Route path="/profile/edit" element={<EditProfile token={token} />} />
        <Route
          path="/match"
          element={
            isLoggedIn ? (
              <Match token={token} />
            ) : (
              <div>Please log in first.</div>
            )
          }
        />
        <Route
          path="/my-matches"
          element={
            isLoggedIn ? (
              <MyMatches token={token} />
            ) : (
              <div>Please log in first.</div>
            )
          }
        />
        <Route
          path="/chat/:receiverId"
          element={
            isLoggedIn ? (
              <ChatPage token={token} />
            ) : (
              <div>Please log in first.</div>
            )
          }
        />
        <Route
          path="/collections/:collectionId"
          element={
            isLoggedIn ? (
              <CollectionPage token={token} />
            ) : (
              <div>Please log in first.</div>
            )
          }
        />
        <Route
          path="/collectioninfo/:collectionId"
          element={
            isLoggedIn ? (
              <CollectionInfo token={token} />
            ) : (
              <div>Please log in first.</div>
            )
          }
        />
        <Route
          path="/collaborations"
          element={
            isLoggedIn ? (
              <CollaborationsPage token={token} />
            ) : (
              <div>Please log in first.</div>
            )
          }
        />
        <Route
          path="/collaborations/:collaborationId"
          element={
            isLoggedIn ? (
              <CollaborationDetailsPage token={token} />
            ) : (
              <div>Please log in first.</div>
            )
          }
        />
        <Route
          path="/my-collaborations"
          element={
            isLoggedIn ? (
              <MyOwnCollaborationsPage token={token} />
            ) : (
              <div>Please log in first.</div>
            )
          }
        />
        <Route
          path="/my-collab-requests"
          element={
            isLoggedIn ? (
              <MyCollabRequestsPage token={token} />
            ) : (
              <div>Please log in first.</div>
            )
          }
        />
        <Route
          path="/approve-collab-requests"
          element={
            isLoggedIn ? (
              <ApproveCollabRequestsPage token={token} />
            ) : (
              <div>Please log in first.</div>
            )
          }
        />
        <Route
          path="/joined-collaborations"
          element={
            isLoggedIn ? (
              <JoinedCollaborationsPage token={token} />
            ) : (
              <div>Please log in first.</div>
            )
          }
        />
        <Route
          path="/create-collaboration"
          element={
            isLoggedIn ? (
              <CreateCollaborationPage token={token} />
            ) : (
              <div>Please log in first.</div>
            )
          }
        />
        <Route
          path="/manage-collaborations"
          element={
            isLoggedIn ? (
              <ManageCollaborations />
            ) : (
              <div>Please log in first.</div>
            )
          }
        />

        <Route
          path="/edit-collaboration/:id"
          element={<EditCollaborationPage token={token} />}
        />


        <Route path="/creators" element={<CreatorsPage token={token} />} />
        <Route path="/creator-info/:id" element={<CreatorInfo token={token} />} />

        <Route path="/my-likes" element={<Likes token={token} />} />
      </Routes>
    </div>
  );
}

export default App;
