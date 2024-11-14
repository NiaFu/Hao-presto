import React, { useState, useEffect } from 'react';
import { Box, Button, Card, CardContent, CardMedia, Typography, Modal, IconButton } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate, useParams } from 'react-router-dom';
import { getStore, updateStore } from './dataService';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const modalStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '8px',
    textAlign: 'center'
};

const slideNumberStyle = {
    position: 'absolute',
    bottom: '10px',
    left: '10px',
    width: '50px',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1em',
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: '4px'
};

const SingleSlide = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [presentation, setPresentation] = useState({});
    const [showEditModal, setShowEditModal] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [showThumbnailModal, setShowThumbnailModal] = useState(false);
    const [newThumbnail, setNewThumbnail] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [totalSlides, setTotalSlides] = useState(0);

    useEffect(() => {
        getPresentation();

        // listener
        const handleKeyDown = (event) => {
            if (event.key === 'ArrowRight') {
                goToNext();
            } else if (event.key === 'ArrowLeft') {
                goToPrevious();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [id]);

    const getPresentation = () => {
        getStore()
            .then(data => {
                const singlePresentation = data.store[id];
                setPresentation(singlePresentation);
                setNewTitle(singlePresentation.title);

                const slides = singlePresentation.slides || [];
                setTotalSlides(slides.length);
                setCurrentIndex(0);
            });
    };

    // delete the presentation
    const deletePresentation = () => {
        const confirmHandler = window.confirm('Are you sure you want to delete this presentation?');
        if (confirmHandler) {
            getStore()
                .then(data => {
                    delete data.store[id];
                    return updateStore(data.store);
                })
                .then(() => navigate('/dashboard'))
                .catch(error => console.error("Error deleting presentation:", error));
        }
    };

    const saveTitle = () => {
        setPresentation(prev => ({ ...prev, title: newTitle }));
        setShowEditModal(false);
        getStore()
            .then(data => {
                data.store[id].title = newTitle;
                return updateStore(data.store);
            });
    };

    const saveThumbnail = () => {
        setPresentation(prev => ({ ...prev, thumbnail: newThumbnail }));
        setShowThumbnailModal(false);
        getStore()
            .then(data => {
                data.store[id].thumbnail = newThumbnail;
                return updateStore(data.store);
            });
    };

    const handleAddSlide = () => {
        const newSlide = { id: totalSlides + 1, content: "" }; // 
        const updatedSlides = [...presentation.slides, newSlide];

        // update the slide
        setPresentation(prev => ({ ...prev, slides: updatedSlides }));
        setTotalSlides(updatedSlides.length);
        setCurrentIndex(updatedSlides.length - 1); // update index

        // fetch
        getStore()
            .then(data => {
                data.store[id].slides = updatedSlides;
                return updateStore(data.store);
            })
            .catch(error => console.error("Error adding new slide:", error));
    }

    const goToNext = () => setCurrentIndex(prev => (prev < totalSlides - 1 ? prev + 1 : prev));
    const goToPrevious = () => setCurrentIndex(prev => (prev > 0 ? prev - 1 : prev));

    return (
        <Box display="flex" flexDirection="column" alignItems="center" sx={{ bgcolor: '#f0f2f5', minHeight: '100vh', p: 4 }}>
            <Button
                startIcon={<ArrowBackIcon />}
                variant="contained"
                color="primary"
                sx={{ alignSelf: 'flex-start', mb: 2 }}
                onClick={() => navigate('/dashboard')}
            >
                Back
            </Button>
            <Button
                startIcon={<DeleteIcon />}
                variant="outlined"
                color="secondary"
                onClick={deletePresentation}
            >
                Delete Presentation
            </Button>

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
                    <br />
                    <Button
                        startIcon={<AddIcon />}
                        variant="contained"
                        color="success"
                        onClick={handleAddSlide}
                    >
                        New Slide
                    </Button>
                </CardContent>
            </Card>

            <Box display="flex" alignItems="center" justifyContent="center" width="100%" maxWidth="600px">
                <IconButton onClick={goToPrevious} disabled={currentIndex === 0} size="large" color="primary">
                    <ArrowBackIosNewIcon />
                </IconButton>
                <Box
                    position="relative"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    height="300px"
                    width="100%"
                    sx={{ bgcolor: 'white', borderRadius: 2, boxShadow: 3, p: 2 }}
                >
                    <Box sx={slideNumberStyle}>{currentIndex + 1}</Box> {/* slide number */}
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
