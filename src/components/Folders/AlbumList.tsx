import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import  { useReducer, useEffect, useState } from 'react';
import axios from 'axios';
import { albumReducer, initialAlbumState, Album } from '../../reducer/AlbumReducer';
import { Button, TextField, Card, CardContent, Typography, Grid, CardActionArea, Box, CardMedia } from '@mui/material';
// import UserContext from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';

const AlbumList = () => {
  const [albums, dispatch] = useReducer(albumReducer, initialAlbumState);
  const [loading, setLoading] = useState(true);
  const [newAlbumName, setNewAlbumName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      const response = await axios.get(`https://localhost:7251/api/album`);
      console.log('Response from server:', response.data);
      // const albumsData: Album[] = response.data;

      dispatch({ type: 'SET_ALBUMS', payload: response.data });
    } catch (error) {
      console.error('שגיאה בטעינת האלבומים:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAlbum = async () => {
    if (!newAlbumName.trim()) {
      alert("שם האלבום לא יכול להיות ריק!");
      return;
  }

    const newAlbum = { name: newAlbumName, images: [] };

    try {
      const response = await axios.post('https://localhost:7251/api/album', newAlbum);
      dispatch({ type: 'CREATE_ALBUM', payload: response.data });
      handleCloseDialog();
    } catch (error) {
      console.error('שגיאה בהוספת אלבום חדש:', error);
    }
  };

  const handleDeleteAlbum = async (albumId: number) => {
    // try {
    //   await axios.delete(`https://localhost:7251/api/album/${albumId}`);
    //   dispatch({ type: 'DELETE_ALBUM', payload: albumId });
    // } catch (error) {
    //   console.error('שגיאה במחיקת האלבום:', error);
    // }
    try {
      await axios.delete(`https://localhost:7251/api/album/${albumId}`);
      dispatch({ type: 'DELETE_ALBUM', payload: albumId });
  } catch (error: any) {
      if (error.response && error.response.status === 400) {
          alert("לא ניתן למחוק אלבום שמכיל תמונות!");
      } else {
          console.error('שגיאה במחיקת האלבום:', error);
          alert("שגיאה במחיקת האלבום. נסה שוב מאוחר יותר.");
      }
  }
  };

  // פונקציה שמבקשת אישור לפני מחיקת אלבום
  const confirmDeleteAlbum = (album: Album) => {
    console.log("Album being deleted:", album);
    console.log("Album images:", album.imageList); 
    if (album.imageList?.length > 0) {
        alert("לא ניתן למחוק אלבום שמכיל תמונות!");
        return;
    }
    if (window.confirm("האם אתה בטוח שברצונך למחוק את האלבום?")) {
        handleDeleteAlbum(album.id);
    }
};
  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setNewAlbumName('');
  };

  const handleAlbumClick = (albumId: number) => {
    navigate(`/albums/${albumId}`); // Navigate to the album details page or perform any other action
  };
 
  if (loading) {
    return <Typography variant="h5">טוען אלבומים...</Typography>;
  }
  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom align="center">
        רשימת אלבומים
      </Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{ marginBottom: '20px' }}
        onClick={handleOpenDialog}
      >
        הוסף אלבום חדש
      </Button>
      <Grid container spacing={3}>
        {albums.map((album) => (
          <Grid item xs={12} sm={6} md={4} key={album.id}>
            <Card sx={{ maxWidth: 345, margin: 'auto', boxShadow: 3 }}>
              <CardActionArea onClick={() => handleAlbumClick(album.id)} />
              <CardMedia
                component="img"
                height="140"
                // image={album.imageList && album.imageList.length > 0
                //   ? album.imageList[0].s3URL // הצגת התמונה הראשונה באלבום
                //   : "/myImages/picture.jpg" // תמונת ברירת מחדל אם אין תמונות}
                // }
                image={album.imageList?.length ? album.imageList[0].s3URL : "/myImages/picture.jpg"}
                alt={album.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {album.name}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => handleAlbumClick(album.id)}
                >
                  צפה באלבום
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  onClick={() => confirmDeleteAlbum(album)}
                  // disabled={album.imageList.length > 0} // הכפתור יהיה לא זמין אם יש תמונות
                >
                  מחק אלבום
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>הוסף אלבום חדש</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="שם האלבום"
            type="text"
            fullWidth
            value={newAlbumName}
            onChange={(e) => setNewAlbumName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            ביטול
          </Button>
          <Button onClick={handleAddAlbum} color="primary">
            הוסף
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default AlbumList;
