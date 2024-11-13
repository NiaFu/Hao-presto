import React, { useState } from 'react';
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
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f5f5f5'
};

const DashBoard = (props) => {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [thumbnail, setThumbnail] = useState(null);
    const navigate = useNavigate();

    const handleClickOpen = () => {
        setOpen(true);
    };

    return (
        <div style={style}>
            <h1>Welcome to Your DashBoard</h1>
            <Button 
                variant="contained" 
                color="primary" 
                onClick={handleClickOpen} 
                style={{ marginTop: '20px' }}
            >
                New Presentation
            </Button>
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