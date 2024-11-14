import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { getStore, updateStore } from './dataService';

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

const ThumbnailModal = {
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
    const [showThumbnailModal, setShowThumbnailModal] = useState(false);
    const [newThumbnail, setNewThumbnail] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);


    const getPresentation = () => {
        getStore()
            .then(data => {
                const singlePresentation = data.store[id];
                setPresentation(singlePresentation);
                setNewTitle(singlePresentation.title);
            });
    }

    useEffect(() => {
        getPresentation();
    }, [id]);

    const deletePresentation = () => {
        const confirmHander = window.confirm('Are you sure?');
        if (confirmHander) {
            getStore()
                .then(data => {
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
                        body: JSON.stringify({ store: data.store }),
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
                return updateStore(data.store);
            });
    };

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // load the thumbnail
            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnailPreview(reader.result);
                setNewThumbnail(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const saveThumbnail = () => {
        // update localdata
        setPresentation(prev => ({ ...prev, thumbnail: newThumbnail }));
        setShowThumbnailModal(false);

        // fetch
        getStore()
            .then(data => {
                data.store[id].thumbnail = newThumbnail;
                return updateStore(data.store);
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
                <Button variant="contained" size="small" onClick={() => setShowThumbnailModal(true)}>Change Thumbnail</Button><br />
                {presentation.thumbnail && (
                    <img src={presentation.thumbnail} alt="Thumbnail" style={{ width: '100px', height: '100px', marginTop: '10px' }} />
                )}
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

            {showThumbnailModal && (
                <div style={ThumbnailModal}>
                    <h3>Change Thumbnail</h3>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        style={{ marginBottom: '10px' }}
                    />
                    {thumbnailPreview && (
                        <img src={thumbnailPreview} alt="Thumbnail Preview" style={{ width: '100px', height: '100px', marginTop: '10px' }} />
                    )}
                    <br />
                    <Button variant="contained" onClick={saveThumbnail}>Save</Button>
                    <Button variant="text" onClick={() => setShowThumbnailModal(false)}>Cancel</Button>
                </div>
            )}

            {/* slide */}
            {/* button */}
        </>
    );
}

export default SingleSlide;