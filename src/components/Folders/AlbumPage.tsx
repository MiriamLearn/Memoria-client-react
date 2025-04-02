
import React, { useReducer, useEffect, useState } from 'react';
import axios from 'axios';
import { Image, imageReducer, initialImageState } from '../../reducer/ImageReducer';
import {
  Box, Button, Typography, Card, CardActions, CardHeader,
  Grid,
  CardMedia,
  Modal,
} from "@mui/material";
import { useNavigate, useParams } from 'react-router-dom';


const AlbumPage = () => {

  const { id } = useParams<{ id: string }>();
  const albumId = parseInt(id || '0');
  if (albumId <= 0) {
    console.error('Invalid album ID:', albumId);
    return;
  }
  const navigate = useNavigate();

  const [images, dispatch] = useReducer(imageReducer, initialImageState);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);


  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await axios.get(`https://localhost:7251/api/album/${albumId}`);
      console.log('Response from server:', response.data);

      const imagesData: Image[] = response.data.imageList;
      console.log('Fetched images:', imagesData);

      dispatch({ type: 'SET_IMAGES', payload: imagesData });
    } catch (error) {
      console.error('שגיאה בטעינת התמונות:', error);
    }
    finally {
      setLoading(false);
    }
  };

  const handleUpload = () => {
    navigate(`/albums/${albumId}/upload`)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    } else {
      console.error('לא נבחר קובץ');
    }
  };

  const handleUpdate = async () => {
    if (!selectedFile || selectedImageId === null) return;
    // setSelectedImageId(id);

    try {
      const response = await axios.get('https://localhost:7251/api/upload/presigned-url', {
        params: { imageName: selectedFile.name, albumId: albumId }
      });

      const presignedUrl = response.data.url;

      await axios.put(presignedUrl, selectedFile, {
        headers: {
          'Content-Type': selectedFile.type,
        },
      });

      const updatedImage: Partial<Image> & { id: number } = {
        id: selectedImageId,
        name: selectedFile.name,
        s3URL: `https://memoria-bucket-testpnoren.s3.amazonaws.com/${selectedFile.name}`,
        size: selectedFile.size,
        albumId: albumId,
      };

      await axios.put(`https://localhost:7251/api/image/${selectedImageId}`, updatedImage);

      dispatch({ type: 'UPDATE_IMAGE', payload: updatedImage });
      alert('התמונה עודכנה בהצלחה!');
    } catch (error) {
      console.error('שגיאה בעדכון התמונה:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`https://localhost:7251/api/image/${id}`);
      dispatch({ type: 'DELETE_IMAGE', payload: { id } });
      alert('התמונה נמחקה בהצלחה!');
    } catch (error) {
      console.error('שגיאה במחיקת התמונה:', error);
    }
  };
  const handleOpenModal = (id: number) => {
    setSelectedImageId(id);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedImageId(null);
    setSelectedFile(null);
  };
  if (loading) return <div>טוען תמונות...</div>;

  return (

    <div style={{ padding: '24px' }}>
      <Typography variant="h4" gutterBottom>
        ניהול תמונות
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        sx={{ marginBottom: 2 }}
      >
        הוסף תמונה
      </Button>
      <Grid container spacing={2} justifyContent="center">
        {images.map((image) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={image.id}>
            <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
              <CardHeader
                title={image.name}
                sx={{ textAlign: 'center', backgroundColor: '#f5f5f5' }}
              />
              <CardMedia
                component="img"
                height="194"
                image={image.s3URL}
                alt={image.name}
              />

              <CardActions sx={{ justifyContent: 'space-between' }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleOpenModal(image.id)}
                >
                  עדכן
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDelete(image.id)}
                >
                  מחק
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: '8px',
          }}
        >
          <Typography variant="h6" gutterBottom>
            עדכון תמונה
          </Typography>
          <input type="file" onChange={handleFileChange} />
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdate}
            disabled={!selectedFile}
            sx={{ marginTop: 2 }}
          >
            עדכן תמונה
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default AlbumPage;