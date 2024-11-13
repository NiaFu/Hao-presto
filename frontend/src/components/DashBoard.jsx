import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

const style = {
    display: 'flex',
    flexDirection: 'column',
    // justifyContent: 'center',
    alignItems: 'center',
    // height: '100vh',
    backgroundColor: '#f5f5f5'
};
const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
    marginTop: '20px'
};

const DashBoard = () => {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [thumbnail, setThumbnail] = useState(null);
    const navigate = useNavigate();
    const [presentations, setPresentations] = useState([]);
    const [currentPresentation, setCurrentPresentation] = useState(null); // currentPresentation
    const [storeData, setStoreData] = useState({});

    useEffect(() => {
        const token = localStorage.getItem('token');
    
        fetch('http://localhost:5005/store', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json'
            }
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            setStoreData(data.store); 
        })
        .catch((error) => console.error("Error fetching store data:", error));
    }, []);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setName('');
        setDescription('');
        setThumbnail(null);
    };

    const handleThumbnailChange = (event) => {
        const file = event.target.files[0];
        setThumbnail(file);
    };

    const handleCreatePresentation = () => {
        const newPresentation = {
            name,
            description,
            thumbnail: thumbnail ? URL.createObjectURL(thumbnail) : null,
            slides: [{ content: "Title Text" }]
        };

        setPresentations([...presentations, newPresentation]);
        handleClose();
    };

    const handleOpenPresentation = (index) => {
        setCurrentPresentation(presentations[index]);
    };

    return (
        <div style={style}>
            {!currentPresentation && (
                <>
                    <div style={headerStyle}>
                        <Button
                            variant="contained" 
                            color="primary" 
                            onClick={handleClickOpen} 
                            style={{ marginTop: '20px' }}
                        >
                            New Presentation
                        </Button>
                    </div>
                    
                    
                    {/* 显示演示文稿列表 */}
                    <div style={{ marginTop: '20px', width: '80%' }}>
                        <h2>Presentations:</h2>
                        {presentations.map((presentation, index) => (
                            <div 
                                key={index} 
                                style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px', cursor: 'pointer' }}
                                onClick={() => handleOpenPresentation(index)}
                            >
                                <h3>{presentation.name}</h3>
                                <p>{presentation.description}</p>
                                {presentation.thumbnail && <img src={presentation.thumbnail} alt="Thumbnail" style={{ width: '100px', height: 'auto' }} />}
                                <p>Slides: {presentation.slides.length}</p>
                            </div>
                        ))}
                    </div>
                </>
            )}
            
            {/* current presentation first page*/}
            {currentPresentation && (
                <div style={{ marginTop: '20px', width: '80%', textAlign: 'center' }}>
                    <h2>{currentPresentation.name}</h2>
                    <div 
                        style={{
                            border: '1px solid #ddd',
                            padding: '50px',
                            marginTop: '20px',
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '200px'
                        }}
                    >
                        {currentPresentation.slides[0].content}
                    </div>
                    <Button onClick={() => setCurrentPresentation(null)} color="primary" style={{ marginTop: '20px' }}>
                        Back to Dashboard
                    </Button>
                </div>
            )}

            {/* Create Handle */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Create New Presentation</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter the details for your new presentation below.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Name"
                        type="text"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <Button
                        variant="contained"
                        component="label"
                        startIcon={<PhotoCamera />}
                        style={{ marginTop: '10px' }}
                    >
                        Upload Thumbnail
                        <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={handleThumbnailChange}
                        />
                    </Button>
                    {thumbnail && <p>Selected file: {thumbnail.name}</p>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleCreatePresentation} color="primary" variant="contained">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default DashBoard;
