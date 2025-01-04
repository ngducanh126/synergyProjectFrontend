import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './pages/navbar/Navbar';
import Home from './pages/home/Home';
import Login from './pages/authentication/Login';
import Register from './pages/authentication/Register';
import Profile from './pages/profile/Profile';
import Match from './pages/match/Match';
import MyMatches from './pages/match/MyMatches';
import ChatPage from './pages/chat/ChatPage';
import CollectionPage from './pages/collection/CollectionPage';
import CollectionInfo from './pages/collection/CollectionInfo';
import CollaborationsPage from './pages/collaboration/CollaborationsPage';
import CollaborationDetailsPage from './pages/collaboration/CollaborationDetailsPage';
import MyOwnCollaborationsPage from './pages/collaboration/MyOwnCollaborationsPage';
import MyCollabRequestsPage from './pages/collaboration/MyCollabRequestsPage';
import ApproveCollabRequestsPage from './pages/collaboration/ApproveCollabRequestsPage';
import JoinedCollaborationsPage from './pages/collaboration/JoinedCollaborationsPage';
import CreateCollaborationPage from './pages/collaboration/CreateCollaborationPage';
import EditProfile from './pages/profile/EditProfile';
import ManageCollaborations from './pages/collaboration/MangeCollaborations';
import CreatorsPage from './pages/creator/CreatorsPage';
import EditCollaborationPage from './pages/collaboration/EditCollaborationPage';
import CreatorInfo from './pages/creator/CreatorInfo';
import Likes from './pages/likes/Likes';
console.log('API Base URL:', process.env.REACT_APP_API_BASE_URL);
function App() {
  console.log('API Base URL:', process.env.REACT_APP_API_BASE_URL);
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
