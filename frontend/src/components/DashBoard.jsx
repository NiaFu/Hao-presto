import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { getStore, updateStore } from './dataService';

const style = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: '#f5f5f5',
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '80%',
  marginTop: '20px',
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))',
  gap: '20px',
  width: '80%',
  marginTop: '20px',
};

const cardStyle = {
  position: 'relative',
  padding: '10px',
  width: '100%',
  aspectRatio: '2 / 1',
  backgroundColor: '#f5f5f5',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  textAlign: 'center',
};

const thumbnailStyle = {
  width: '20%',
  height: 'auto',
  paddingBottom: '20%',
  backgroundColor: '#ccc',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: '10px',
};

const placeholderStyle = {
  width: '100%',
  height: '100%',
  backgroundColor: '#ccc',
};

const textStyle = {
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  width: '80%',
};

const DashBoard = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const navigate = useNavigate();
  const [presentations, setPresentations] = useState([]);

  useEffect(() => {
    getStore()
      .then((data) => {
        if (data && data.store) {
          setPresentations(
            Object.entries(data.store)
              .filter(([key]) => !isNaN(key))
              .map(([key, value]) => ({ ...value, id: key }))
          );
        }
      })
      .catch((error) => {
        console.error('Error fetching presentations:', error);
        alert('Failed to fetch presentations. Please check console for details.');
      });
  }, []);

  const handleClickOpen = () => setOpen(true);

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

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const postnew = (title, description, thumbnail) => {
    getStore()
      .then(async (data) => {
        const storeData = data.store && typeof data.store === 'object' ? data.store : {};
        const existingIds = Object.keys(storeData).map((id) => parseInt(id, 10));
        const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
        const newId = maxId + 1;

        const thumbnailData = thumbnail ? await getBase64(thumbnail) : null;
        storeData[newId] = {
          title,
          description,
          thumbnail: thumbnailData,
          slides: [{ id: 1, content: '' }],
        };

        return updateStore(storeData);
      })
      .then((updatedData) => {
        if (updatedData && updatedData.store) {
          setPresentations(Object.values(updatedData.store));
        } else {
          console.warn("Unexpected response format: 'store' field missing.");
        }
        handleClose();
      });
  };

  const handleOpenPresentation = (id) => navigate(`/edit/${id}`);

  return (
    <div style={style}>
      <div style={headerStyle}>
        <Button variant="contained" color="primary" onClick={handleClickOpen} style={{ marginTop: '20px' }}>
          New Presentation
        </Button>
      </div>

      <div style={gridStyle}>
        {Array.isArray(presentations) &&
          presentations.map((presentation) => (
            <div key={presentation.id} style={cardStyle} onClick={() => handleOpenPresentation(presentation.id)}>
              <div style={thumbnailStyle}>
                {presentation.thumbnail ? (
                  <img src={presentation.thumbnail} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={placeholderStyle} />
                )}
              </div>
              <h3 style={{ margin: '1px 0', ...textStyle }}>{presentation.title}</h3>
              {presentation.description && <p style={{ fontSize: '0.9rem', color: '#666', ...textStyle }}>{presentation.description}</p>}
              <p style={{ fontSize: '0.8rem', color: '#999' }}>
                Slides: {presentation.slides ? presentation.slides.length : 0}
              </p>
            </div>
          ))}
      </div>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create New Presentation</DialogTitle>
        <DialogContent>
          <DialogContentText>Enter the details for your new presentation below.</DialogContentText>
          <TextField autoFocus margin="dense" label="Name" type="text" fullWidth value={name} onChange={(e) => setName(e.target.value)} />
          <TextField margin="dense" label="Description" type="text" fullWidth multiline rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
          <Button variant="contained" component="label" startIcon={<PhotoCamera />} style={{ marginTop: '10px' }}>
            Upload Thumbnail
            <input type="file" accept="image/*" onChange={handleThumbnailChange} />
          </Button>
          {thumbnail && <p>Selected file: {thumbnail.name}</p>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={() => postnew(name, description, thumbnail)} color="primary" variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DashBoard;