import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { getStore, updateStore } from './dataService';
import { width } from '@mui/system';

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

    const [currentIndex, setCurrentIndex] = useState(1);
    const [totalSlides, setTotalSlides] = useState(1);


    const getPresentation = () => {
        getStore()
            .then(data => {
                const singlePresentation = data.store[id];
                setPresentation(singlePresentation);
                setNewTitle(singlePresentation.title);

                const slides = singlePresentation.slides || []; // slides list
                setTotalSlides(slides.length);
                setCurrentIndex(1); // reload to first page
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

    const goToNext = () => setCurrentIndex(prev => (prev < totalSlides - 1 ? prev + 1 : prev));
    const goToPrevious = () => setCurrentIndex(prev => (prev > 0 ? prev - 1 : prev));

    return (
        <Box display="flex" flexDirection="column" alignItems="center" sx={{ bgcolor: '#f0f2f5', minHeight: '100vh', p: 4 }}>
            <Card sx={{ width: '80%', maxWidth: 600, mb: 4, p: 2, borderRadius: 3, boxShadow: 3 }}>
                <CardContent>
                    <Typography variant="h5" component="div" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        {presentation.title}
                        <IconButton onClick={() => setShowEditModal(true)} color="primary">
                            <EditIcon />
                        </IconButton>
                    </Typography>
                    {presentation.thumbnail && (
                        <CardMedia
                            component="img"
                            height="200"
                            image={presentation.thumbnail}
                            alt="Presentation Thumbnail"
                            sx={{ borderRadius: 2, my: 2 }}
                        />
                    )}
                    <Button variant="contained" color="primary" sx={{ mb: 1 }} onClick={() => setShowThumbnailModal(true)}>
                        Change Thumbnail
                    </Button>
                </CardContent>
            </Card>

            <Box display="flex" alignItems="center" justifyContent="center" width="100%" maxWidth="600px">
                <IconButton onClick={goToPrevious} disabled={currentIndex === 0} size="large" color="primary">
                    <ArrowBackIosNewIcon />
                </IconButton>
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    height="300px"
                    width="100%"
                    sx={{ bgcolor: 'white', borderRadius: 2, boxShadow: 3, p: 2 }}
                >
                    <Typography variant="h6" color="text.secondary">
                        Slide {currentIndex + 1} of {totalSlides}
                    </Typography>
                </Box>
                <IconButton onClick={goToNext} disabled={currentIndex === totalSlides - 1} size="large" color="primary">
                    <ArrowForwardIosIcon />
                </IconButton>
            </Box>

            <Modal open={showEditModal} onClose={() => setShowEditModal(false)}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" component="h2">Edit Title</Typography>
                    <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        style={{ margin: '10px 0', padding: '10px', width: '100%', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    <Button onClick={saveTitle} variant="contained" sx={{ mt: 2 }}>Save</Button>
                </Box>
            </Modal>

            <Modal open={showThumbnailModal} onClose={() => setShowThumbnailModal(false)}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" component="h2">Change Thumbnail</Typography>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => setThumbnailPreview(reader.result);
                                reader.readAsDataURL(file);
                                setNewThumbnail(reader.result);
                            }
                        }}
                        style={{ margin: '10px 0', padding: '10px', width: '100%' }}
                    />
                    {thumbnailPreview && (
                        <CardMedia
                            component="img"
                            height="150"
                            image={thumbnailPreview}
                            alt="Thumbnail Preview"
                            sx={{ borderRadius: 2, my: 2 }}
                        />
                    )}
                    <Button onClick={saveThumbnail} variant="contained" sx={{ mt: 2 }}>Save</Button>
                </Box>
            </Modal>
        </Box>
    );
};

export default SingleSlide;