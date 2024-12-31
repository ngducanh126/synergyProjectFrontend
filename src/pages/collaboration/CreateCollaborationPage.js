import React, { useState } from 'react';
import './CreateCollaboration.css';

function CreateCollaborationPage({ token }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!name) {
            setError('Collaboration name is required');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            if (profilePicture) {
                formData.append('profile_picture', profilePicture);
            }

            const response = await fetch('http://127.0.0.1:5000/collaboration/create', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create collaboration.');
            }

            const data = await response.json();
            setSuccessMessage(`Collaboration "${name}" created successfully!`);
            setName('');
            setDescription('');
            setProfilePicture(null);
        } catch (err) {
            setError(err.message || 'An unexpected error occurred.');
        }
    };

    return (
        <div className="collaborations-container">
            <h1 className="collaborations-title">Create a New Collaboration</h1>
            {error && <p className="error-message">{error}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
            <form className="collaboration-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Collaboration Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="collaboration-input"
                />
                <textarea
                    placeholder="Collaboration Description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="collaboration-textarea"
                ></textarea>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProfilePicture(e.target.files[0])}
                    className="file-input"
                />
                <button type="submit" className="action-button">
                    Create Collaboration
                </button>
            </form>
        </div>
    );
}

export default CreateCollaborationPage;
