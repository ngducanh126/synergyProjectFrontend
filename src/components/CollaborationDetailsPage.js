import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function CollaborationDetailsPage() {
    const { collaborationId } = useParams();
    const [collaboration, setCollaboration] = useState(null);

    useEffect(() => {
        fetch(`http://127.0.0.1:5000/collaboration/${collaborationId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        })
            .then(response => response.json())
            .then(data => setCollaboration(data))
            .catch(error => console.error(error));
    }, [collaborationId]);

    if (!collaboration) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>{collaboration.name}</h1>
            <p>{collaboration.description}</p>
            <p>Admin: {collaboration.admin_name}</p>
        </div>
    );
}

export default CollaborationDetailsPage;
