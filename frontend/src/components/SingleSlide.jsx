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
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

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
  textAlign: 'center',
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
  borderRadius: '4px',
};

const createTextStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
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

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [size, setSize] = useState('');
  const [text, setText] = useState('');
  const [fontSize, setFontSize] = useState('');
  const [color, setColor] = useState('');
  const [editingBoxId, setEditingBoxId] = useState(null);

  useEffect(() => {
    getPresentation();

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
        if (!newThumbnail) {
            console.error("Thumbnail is not set.");
            return;
        }

        setPresentation(prev => ({ ...prev, thumbnail: newThumbnail }));
        setShowThumbnailModal(false);
        getStore()
            .then(data => {
                data.store[id].thumbnail = newThumbnail;
                return updateStore(data.store);
            })
            .then(() => {
                console.log("Thumbnail updated successfully on backend.");
            })
            .catch(error => console.error("Error updating thumbnail:", error));
    };

    const handleAddSlide = () => {
        // set slides id
        const maxId = presentation.slides.length > 0
            ? Math.max(...presentation.slides.map(slide => slide.id))
            : 0;
        const newSlide = { id: maxId + 1, content: "" };

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
    };

    // delete slide
    const handleDeleteSlide = () => {
        if (presentation.slides.length === 1) {
            alert("Cannot delete the only slide. Please delete the entire presentation.");
            return;
        }

        const updatedSlides = presentation.slides.filter((_, index) => index !== currentIndex);
        const newIndex = currentIndex === 0 ? 0 : currentIndex - 1;

        setPresentation(prev => ({ ...prev, slides: updatedSlides }));
        setTotalSlides(updatedSlides.length);
        setCurrentIndex(newIndex);

        // fetch
        getStore()
            .then(data => {
                data.store[id].slides = updatedSlides;
                return updateStore(data.store);
            })
            .catch(error => console.error("Error deleting slide:", error));
    };

    const goToNext = () => setCurrentIndex(prev => (prev < totalSlides - 1 ? prev + 1 : prev));
    const goToPrevious = () => setCurrentIndex(prev => (prev > 0 ? prev - 1 : prev));

    const handleDoubleClick = (id, box) => {
        setEditingBoxId(id);
        setSize(box.size);
        setText(box.text);
        setFontSize(box.fontSize);
        setColor(box.color);
        handleOpen();
    };

    const addTextBox = () => {
        // new Id
        const ElementId = `box_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        const textBox = {
            size: size,
            text: text,
            fontSize: fontSize,
            color: color,
            position: { x: 0, y: 0 }
        }
        const updatedSlides = presentation.slides.map((slide, index) => {
            if (index === currentIndex) {
                const content = slide.content || {};
                return {
                    ...slide,
                    content: editingBoxId
                        ? { ...content, [editingBoxId]: textBox } 
                        : { ...content, [`box_${Date.now()}_${Math.floor(Math.random() * 1000)}`]: textBox }  // 新增文本框
                };
            }
            return slide;
        });

        // reset
        setPresentation(prev => ({ ...prev, slides: updatedSlides }));
        setEditingBoxId(null);

        // fetch
        getStore()
            .then(data => {
                data.store[id].slides = updatedSlides;
                return updateStore(data.store);
            })
            .then(() => {
                setSize('');
                setText('');
                setFontSize('');
                setColor('');
                handleClose();
            })
            .catch(error => console.error("Error adding text box:", error));
    };

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

            <Card sx={{ width: '100%', maxWidth: 600, mb: 4, p: 2, borderRadius: 3, boxShadow: 3 }}>
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
                    flexDirection="column"  
                    alignItems="flex-start"
                    justifyContent="flex-start"
                    height="30vh"  
                    width="90vw" 
                    sx={{ bgcolor: 'white', borderRadius: 2, boxShadow: 3, p: 2 }}
                >
                    {/* delete slide */}
                    <IconButton
                        onClick={handleDeleteSlide}
                        color="error"
                        sx={{ position: 'absolute', top: '10px', right: '10px' }}
                    >
                        <DeleteOutlineIcon />
                    </IconButton>
                    {/* index */}
                    <Box sx={slideNumberStyle}>{currentIndex + 1}</Box> {/* slide number */}

                    {/* display TextBox */}
                    {presentation.slides && presentation.slides[currentIndex] ? (
                        <>
                            {/* delete slide button */}
                            <IconButton
                                onClick={handleDeleteSlide}
                                color="error"
                                sx={{ position: 'absolute', top: '10px', right: '10px' }}
                            >
                                <DeleteOutlineIcon />
                            </IconButton>

                            {/* display text */}
                            {presentation.slides[currentIndex].content &&
                                Object.entries(presentation.slides[currentIndex].content).map(([key, box]) => (
                                    <Box
                                        key={key}
                                        sx={{
                                            position: 'relative',
                                            textAlign: 'left',
                                            overflow: 'hidden',
                                            whiteSpace: 'nowrap',
                                            textOverflow: 'ellipsis',
                                            fontSize: `${box.fontSize}em`,
                                            color: box.color,
                                            width: `${box.size}%`,
                                            border: '1px solid #ccc',
                                            padding: '4px',
                                            marginBottom: '4px'
                                        }}
                                        onDoubleClick={() => handleDoubleClick(key, box)}
                                    >
                                        {box.text}
                                    </Box>
                                ))}
                        </>
                    ) : (
                        <Typography variant="body1" color="textSecondary">No slide content available.</Typography>
                    )}
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
                                reader.onloadend = () => {
                                    setThumbnailPreview(reader.result); 
                                    setNewThumbnail(reader.result);     
                                };
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

            <Button onClick={handleOpen}>Create Text</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={createTextStyle}>
                    size (%): <input type='text' onChange={(e) => setSize(e.target.value)} value={size} /> <br />
                    text: <input type='text' onChange={(e) => setText(e.target.value)} value={text} /> <br />
                    font size (em): <input type='text' onChange={(e) => setFontSize(e.target.value)} value={fontSize} /> <br />
                    color (HEX): <input type='text' onChange={(e) => setColor(e.target.value)} value={color} /> <br />
                    <Button variant="contained" onClick={addTextBox} >add</Button>
                </Box>
            </Modal>
        </Box>


    );
};

export default SingleSlide;
