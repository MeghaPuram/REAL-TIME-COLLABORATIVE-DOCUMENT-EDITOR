import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import Navbar from './Navbar.jsx';
import './Home.css';
import ManagePermissionsModal from './ManagePermissionsModal';


const Home = () => {

    const location = useLocation();
    const username = new URLSearchParams(location.search).get('username');

    const [documents, setDocuments] = useState([]);
    const [enabledSharedDocuments, setEnabledSharedDocuments] = useState([]);
    const [disabledSharedDocuments, setDisabledSharedDocuments] = useState([]);
    const [filename, setFilename] = useState('');
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [usernameInput, setUsernameInput] = useState('');
    const [fileNameInput, setFileNameInput] = useState('');
    const [canEdit, setCanEdit] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
    const [isSendModalOpen, setIsSendModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedSection, setSelectedSection] = useState('myDocuments');

    useEffect(() => {
        fetchDocuments();
        fetchEnabledSharedDocuments();
        fetchDisabledSharedDocuments();
    }, [username, selectedDocument]);

    const fetchDocuments = async () => {
        try {
            const { data } = await axios.get(`http://localhost:8080/api/documents/${username}`);
            setDocuments(data);
        } catch (error) {
            console.error('Error fetching documents:', error);
        }

    };

    const fetchEnabledSharedDocuments = async () => {

        try {
            const enabledResponse = await axios.get(`http://localhost:8080/api/shared/enabled/${username}`);
            setEnabledSharedDocuments(enabledResponse.data);
        } catch (error) {
            console.error('Error fetching shared documents:', error);
        }
    };

    const fetchDisabledSharedDocuments = async () => {
        try {

            const disabledResponse = await axios.get(`http://localhost:8080/api/shared/disabled/${username}`);
            setDisabledSharedDocuments(disabledResponse.data);

        } catch (error) {
            console.error('Error fetching shared documents:', error);
        }
    };

    const handleCreateDocument = async () => {
        if (!filename.trim()) return;

        try {
            const { data } = await axios.post('http://localhost:8080/api/documents', {
                filename,
                author: username,
                content: ''
            });

            setDocuments([...documents, data]);
            setFilename('');
            setIsCreateModalOpen(false);
        } catch (error) {
            console.error('Error creating document:', error);
        }

    };

    const handleOpenDocument = (document, canEdit) => {
        const queryString = `?username=${username}&documentId=${document.id}&filename=${encodeURIComponent(document.filename)}&author=${encodeURIComponent(document.author)}&content=${encodeURIComponent(document.content)}&canEdit=${canEdit}`;

        window.location.href = `/TextEditor${queryString}`;
    };

    const handleSendDocument = async () => {
        if (!usernameInput) {
            console.error('Please select a document and enter a username.');
            return;
        }

        try {
            await axios.post('http://localhost:8080/api/shared', {
                username: usernameInput,
                documentId: selectedDocument.id,
                canEdit
            });

            setSelectedDocument(null);
            setUsernameInput('');
            setCanEdit(false);
            setIsSendModalOpen(false);
        } catch (error) {
            console.error('Error sending document:', error);
        }

    };

    const handleRenameDocument = async () => {
        if (!fileNameInput.trim()) {

            return;
        }

        selectedDocument.filename = fileNameInput;

        try {
            await axios.put(`http://localhost:8080/api/documents/rename/${selectedDocument.id}`, {
                ...selectedDocument,
                filename: fileNameInput
            });

            setFileNameInput('');
            setIsRenameModalOpen(false);
            fetchDocuments(); // Refresh the list after renaming
        } catch (error) {
            console.error('Error renaming document:', error);
        }
    };

    const handleDeleteDocument = async (document) => {
        try {
            await axios.delete(`http://localhost:8080/api/documents/delete/${document.id}`);
            fetchDocuments();
        } catch (error) {
            console.error('Error deleting document:', error);
        }
    };

    const handleManagePermissions = async (document) => {
        setSelectedDocument(document);
        setIsModalOpen(true);
    };

    const handleRenameModalOpen = (document) => {
        setSelectedDocument(document);
        setIsRenameModalOpen(true);
    };

    const handleRenameModalClose = () => {
        setIsRenameModalOpen(false);
    };

    const handleSendModalOpen = (document) => {
        setSelectedDocument(document);
        setIsSendModalOpen(true);
    };

    const handleSendModalClose = () => {
        setIsSendModalOpen(false);
    };

    const handleCreateModalOpen = () => {
        setIsCreateModalOpen(true);
    };

    const handleCreateModalClose = () => {
        setIsCreateModalOpen(false);
    };

    return (
        <div className="home">
            <Navbar />
            <div className='header'>
                <p>Welcome, {username}!</p>
                <div className='header-options'>
                    <select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)}>
                        <option value="myDocuments">My Documents</option>
                        <option value="sharedWithMe">Shared with Me</option>
                    </select>

                    <button onClick={() => handleCreateModalOpen()}>+</button>
                </div>
            </div>
            <div className="document-list-container">
                {selectedSection === 'myDocuments' && (
                    <div className="document-container">
                        <div className="document-list">
                            <h2>My Documents</h2>
                            <ul>
                                {documents.map(document => (
                                    <li className='document-list' key={document.id}>

                                        <p onClick={() => handleOpenDocument(document, true)}>{document.filename}</p>
                                        <div className='buttons-container'>
                                            <button onClick={() => handleOpenDocument(document, true)}>Edit</button>
                                            <button onClick={() => handleRenameModalOpen(document)}>Rename</button>
                                            <button onClick={() => handleManagePermissions(document)}>Manage</button>
                                            <button onClick={() => handleSendModalOpen(document)}>Send</button>
                                            <button onClick={() => handleDeleteDocument(document)}>Delete</button>

                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
                {selectedSection === 'sharedWithMe' && (
                    <div className="document-container">
                        <div className="document-list">
                            <h2>Shared with Me</h2>
                            <ul>
                                {enabledSharedDocuments.map(document => (
                                    <li key={document.id}>
                                        <p onClick={() => handleOpenDocument(document, true)}>{document.filename}</p>
                                        <div className='buttons-container buttons-container-shared'>
                                            <button onClick={() => handleOpenDocument(document, true)}>Edit</button>
                                            <button onClick={() => handleRenameModalOpen(document)}>Rename</button>
                                            <button onClick={() => handleSendModalOpen(document)}>Send</button>
                                        </div>
                                    </li>
                                ))}
                                {disabledSharedDocuments.map(document => (
                                    <li key={document.id}>
                                        <span onClick={() => handleOpenDocument(document, false)}>{document.filename}</span>
                                        <p><i>(View Only)</i></p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
            <ManagePermissionsModal
                isOpen={isModalOpen}
                closeModal={() => setIsModalOpen(false)}
                document={selectedDocument}
            >
                <div className="Manage-document">
                    <h2>Manage Permissions</h2>
                    <button onClick={() => setIsModalOpen(false)}>Cancel</button>
                </div>
            </ManagePermissionsModal>
            {isRenameModalOpen && (
                <Modal isOpen={isRenameModalOpen} onRequestClose={handleRenameModalClose}>
                    <div className="rename-document">
                        <h2>Rename Document</h2>
                        <input
                            type="text"
                            placeholder="Enter new name"
                            value={fileNameInput}
                            onChange={(e) => setFileNameInput(e.target.value)}
                        />
                        <button onClick={handleRenameDocument}>Rename Document</button>
                        <button onClick={handleRenameModalClose}>Cancel</button>
                    </div>
                </Modal>
            )}
            {isSendModalOpen && (
                <Modal isOpen={isSendModalOpen} onRequestClose={handleSendModalClose}>
                    <div className="send-document">
                        <h2>Send Document</h2>
                        <input
                            type="text"
                            placeholder="Enter username"
                            value={usernameInput}
                            onChange={(e) => setUsernameInput(e.target.value)}
                        />
                        <label>
                            <input
                                type="checkbox"
                                checked={canEdit}
                                onChange={() => setCanEdit(!canEdit)}
                            />
                            Can Edit
                        </label>
                        <button onClick={handleSendDocument}>Send Document</button>
                        <button onClick={handleSendModalClose}>Cancel</button>
                    </div>
                </Modal>
            )}
            {isCreateModalOpen && (
                <Modal isOpen={isCreateModalOpen} onRequestClose={handleCreateModalClose}>
                    <div className="create-document">
                        <h2>Create New Document</h2>
                        <input
                            type="text"
                            placeholder="Enter filename"
                            value={filename}
                            onChange={(e) => setFilename(e.target.value)}
                        />
                        <button onClick={handleCreateDocument}>Add</button>
                        <button onClick={handleCreateModalClose}>Cancel</button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Home;