import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { getStore } from './dataGet';

const editTitle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: '20px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    textAlign: 'center'
}
const SingleSlide = () => {
    const { id } = useParams();
    // console.log(id);
    const navigate = useNavigate();
    const [presentation, setPresentation] = useState({});
    const [showEditModal, setShowEditModal] = useState(false);
    const [newTitle, setNewTitle] = useState("");


    const getPresentation=()=>{
        getStore()
        .then(data=>{
            const singlePresentation = data.store[id];
            setPresentation(singlePresentation);
            setNewTitle(singlePresentation.title); 
        });
    }

    useEffect(() => {
        getPresentation();
    }, [id]);

    const deletePresentation = () =>{
        const confirmHander = window.confirm('Are you sure?');
        if (confirmHander) {
            getStore()
            .then(data=>{
                delete data.store[id];
                console.log(data);

                //Put
                const userToken = localStorage.getItem('token');
                fetch('http://localhost:5005/store', {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${userToken}`, 
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({store: data.store}),
                })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })

                navigate('/dashboard');
            })
        }
    };

    const saveTitle = () => {
        // reset the title
        setPresentation(prev => ({ ...prev, title: newTitle }));
        setShowEditModal(false);

        // fetch the title
        getStore()
            .then(data => {
                data.store[id].title = newTitle;

                const userToken = localStorage.getItem('token');
                fetch('http://localhost:5005/store', {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${userToken}`, 
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ store: data.store }),
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                });
            });
    };

    return (
        <>
        {/* top */}
        <div>
            <Button variant="contained" onClick={() => navigate('/dashboard')}>Back</Button>
            <Button variant="contained" onClick={(deletePresentation)}>Delete Presentation</Button>
            <h1>Title:{presentation.title}
                <br />
                <Button variant="contained" size="small" onClick={() => setShowEditModal(true)}>Edit</Button>
            </h1>
        </div>

        {/* Edit Title Modal */}
        {showEditModal && (
                <div style={editTitle}>
                    <h3>Edit Title</h3>
                    <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        style={{ marginBottom: '10px', padding: '5px', width: '100%' }}
                    />
                    <br />
                    <Button variant="contained" onClick={saveTitle}>Save</Button>
                    <Button variant="text" onClick={() => setShowEditModal(false)}>Cancel</Button>
                </div>
            )}

        {/* slide */}
        {/* button */}
        </>
    );
}

export default SingleSlide;