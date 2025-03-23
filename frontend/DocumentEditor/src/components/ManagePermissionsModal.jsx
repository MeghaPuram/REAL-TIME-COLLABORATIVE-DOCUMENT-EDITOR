import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './Home.css';

const ManagePermissionsModal = ({ isOpen, closeModal, document }) => {
    const [sharedUsers, setSharedUsers] = useState([]);
    const [shouldUpdate, setShouldUpdate] = useState(false); // State variable to trigger rerender

    useEffect(() => {
        if (isOpen && document) {
            fetchSharedUsers(document.id);
        }
    }, [isOpen, document, shouldUpdate]); // Include shouldUpdate in dependencies

    const fetchSharedUsers = async (documentId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/shared/sent-to/${documentId}`);
            setSharedUsers(response.data);
        } catch (error) {
            console.error('Error fetching shared users:', error);
        }
       
    };

    const handleEnableEditing = async (sharedInfo, canEdit) => {
        sharedInfo.canEdit = true;
        try {
            const updatedInfo = { ...sharedInfo, canEdit };
            await axios.put(`http://localhost:8080/api/shared/permissions/${sharedInfo.id}`);
            
            // Update state instead of forcing re-render
            setSharedUsers(prevUsers =>
                prevUsers.map(user =>
                    user.id === sharedInfo.id ? { ...user, canEdit } : user
                )
            );
        } catch (error) {
            console.error('Error updating permissions:', error);
        }
        /*try {
            const response = await fetch(`http://localhost:8080/shared/permissions/${sharedInfo.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(sharedInfo),
            });
    
            if (!response.ok) {
                throw new Error('Failed to update permissions');
            }
    
            // Toggle shouldUpdate to trigger rerender
            setShouldUpdate(prevState => !prevState);
        } catch (error) {
            console.error('Error updating permissions:', error);
        }*/
    };
    
    const handleDisableEditing = async (sharedInfo, canEdit) => {
        sharedInfo.canEdit = false;
        try {
            const updatedInfo = { ...sharedInfo, canEdit };
            await axios.put(`http://localhost:8080/api/shared/permissions/${sharedInfo.id}`);
            
            // Update state instead of forcing re-render
            setSharedUsers(prevUsers =>
                prevUsers.map(user =>
                    user.id === sharedInfo.id ? { ...user, canEdit } : user
                )
            );
        } catch (error) {
            console.error('Error updating permissions:', error);
        }
        /*try {
            const response = await fetch(`http://localhost:8080/shared/permissions/${sharedInfo.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(sharedInfo),
            });
    
            if (!response.ok) {
                throw new Error('Failed to update permissions');
            }
    
            // Toggle shouldUpdate to trigger rerender
            setShouldUpdate(prevState => !prevState);
        } catch (error) {
            console.error('Error updating permissions:', error);
        }*/
    };
useEffect(() =>{
    Modal.setAppElement('body');
},[]);
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={closeModal}
        >
            <div className="Manage-document">
            <h2>Manage Permissions</h2>
            {sharedUsers.length > 0 ? (
                <ul>
                    {sharedUsers.map(user => (
                        <div>
                            <li key={user.id}>{user.username}</li>
                            <p>Enable Editing: {user.canEdit.toString()}</p>
                            <button onClick={() => handleEnableEditing(user)}>Enable</button>
                            <button onClick={() => handleDisableEditing(user)}>Disable</button>
                        </div>
                    ))}
                </ul>
            ) : (
                <p>No shared users found for this document.</p>
            )}
            <button onClick={closeModal}>Close</button>
            </div>
        </Modal>
    );
};

export default ManagePermissionsModal;