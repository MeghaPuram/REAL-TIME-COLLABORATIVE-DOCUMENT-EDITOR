import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Stomp } from '@stomp/stompjs';
import axios from 'axios';
import SockJS from 'sockjs-client';
import ReactQuill, { Quill } from "react-quill-new"
import 'quill/dist/quill.snow.css';
import './TextEditor.css';
import Navbar from './Navbar.jsx';

const TextEditor = () => {
    
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const documentId = queryParams.get('documentId');
    const filename = queryParams.get('filename');
    const author = queryParams.get('author');
    const [content, setContent] = useState('');
    const canEdit = queryParams.get('canEdit');

    const editorRef = useRef(null);
    const stompClientRef = useRef(null);

    let sessionId = null;
    let n = 0;
    let buffer = content;
    let SpaceFlag = false;
    let localIndex = 0;

    var pending = [];

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
       
            try {
                const response = await axios.get(`http://localhost:8080/api/documents/content/${documentId}`);
                setContent(response.data);
            } catch (error) {
                console.error('Error fetching document content:', error);
            }
        };

    useEffect(() => {
        n = n + 1;
        if (n === 1) {
            sessionId = generateSessionId();
          
            if (sessionId) {
                // Initialize Stomp client
                sessionId = generateSessionId();
                const socket = new SockJS('http://localhost:8080/ws');
                const client = Stomp.over(socket);

                client.connect({}, () => {
                    console.log('WebSocket connection established.');
                    stompClientRef.current = client;

                  
                        stompClientRef.current.subscribe(`/all/broadcast/${documentId}`, (message) => {
                            const receivedMessage = JSON.parse(message.body);
                            handleRemoteChange(receivedMessage);
                        });
                      
                }, (error) => {
                    console.error('WebSocket connection failed:', error);
                });
                return () => {
                    if (stompClientRef.current) {
                        stompClientRef.current.disconnect();
                    }
                };
            }     
        } 
    }, []);


    useEffect(() => {
        if (!editorRef.current) {
            // Initialize Quill editor
            editorRef.current = new Quill('#editor-container', {
                modules: {
                    toolbar: [
                        ['bold', 'italic']
                    ],
                },
                theme: 'snow'
            });

            editorRef.current.on('text-change', handleTextChange);

            editorRef.current.clipboard.dangerouslyPasteHTML(content);
         editorRef.current.enable(canEdit);
          
        }
    }, [content, canEdit]);

    const handleSave = async() => {
        const newContent = editorRef.current.root.innerHTML;

        const documentObject = {
            _id: documentId,
            filename: filename,
            author: author,
            content: newContent
        };
        try {
            await axios.put(`http://localhost:8080/api/documents/update/${documentId}`, documentObject);
            console.log('Document saved successfully.');
        } catch (error) {
            console.error('Error saving document:', error);
        }
       
    };

    const handleSendMessage = (insertedIndex, insertedChar) => {
        if (stompClientRef.current !== null ) {
            
            stompClientRef.current.send(`/app/operation/${documentId}`, {}, JSON.stringify({ insertedIndex, insertedChar, sessionId  }));
        }
    };

    const handleTextChange = (delta, oldDelta, source) => {
        if (source !== 'user') return;
       
      let insertedIndex = editorRef.current.getSelection()?.index || 0;
        let insertedChar = null;
    delta.ops.forEach(op => {
        if (op.insert) {
            insertedChar = typeof op.insert === 'string' ? op.insert : '[IMAGE]';
            insertedIndex = insertedIndex - 1; // Adjust index for insertions
        } else if (op.delete) {
            insertedChar = 'delete';
            insertedIndex = insertedIndex + 1; // Adjust index for deletions
        }
    });

    if (insertedChar !== null) {
        // Send message only once
        handleSendMessage(insertedIndex, insertedChar);
    }
       
    };

    const handleRemoteChange = (change) => {
    if (pending.some((msg) => JSON.stringify(msg) === JSON.stringify(change))) {
        return;
    }
        if (change.insertedChar === 'delete') {
            deleteAtIndex(change.insertedIndex);
        } else {
            insertAtIndex(change.insertedIndex, change.insertedChar);
        }
        pending = pending.filter((msg) => JSON.stringify(msg) !== JSON.stringify(change));
    };

    function removeAtIndex(array, index) {
        if (index < 0 || index >= array.length) {
            return array;
        }
        array.splice(index, 1);
        return array;
    }

    function insertAtIndex(index, character) {

 if (SpaceFlag === true && character !== '\n') {
            index = index + 1;

            SpaceFlag = false;
        }
        if (character === '\n') {
            SpaceFlag = true;
        }
        buffer = buffer.substring(0, index) + character + buffer.substring(index);

        let plainText = buffer.replace(/<[^>]+>/g, '');
        
        setContent(buffer);
        editorRef.current.setText(plainText);

        if (index <= localIndex) {
            
            localIndex++;
        }
        editorRef.current.setSelection(localIndex );
        
    }

    function deleteAtIndex(index) {
    const editor = editorRef.current;
    const text = editor.getText();

    if (index < 0 || index >= text.length) return; // Prevent invalid deletion

    // Update text after deletion
    const updatedText = text.slice(0, index) + text.slice(index + 1);
    editor.setText(updatedText);

    // Move cursor back to the deleted index
    editor.setSelection(index);
    
    }

    function generateSessionId() {
     return `session-${Date.now()}-${Math.random().toString(36).slice(2)}`;
       
    }
    
    return (
        <div>
            <Navbar />
            <div className='header header-Texteditor'>
                <p>{filename} </p>
            </div>

            <div id="editor-container" className="editor-container" />

        </div>
    );
};

export default TextEditor;