import React, { useContext, useState } from 'react';
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
} from '@mui/material';
import UserContext from '../context/UserContext';

const UpdateUser: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const {dispatch } = useContext(UserContext);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    address: '',
    phone: '',
  });

  const handleUpdate = () => {
    dispatch({ type: 'UPDATE_USER', payload: form });
    onClose();
  };

  return (
    <Modal open onClose={onClose}>
      <Box sx={{ p: 3, bgcolor: 'white', margin: 'auto', width: 400, mt: 10 }}>
        <Typography variant="h6">Update User Details</Typography>
        {Object.keys(form).map((key) => (
          <TextField
            key={key}
            label={key.charAt(0).toUpperCase() + key.slice(1)}
            fullWidth
            margin="normal"
            value={form[key as keyof typeof form]}
            onChange={(e) =>
              setForm({ ...form, [key]: e.target.value })
            }
          />
        ))}
        <Button variant="contained" onClick={handleUpdate} sx={{backgroundColor: '#b7a710', color: 'white', padding: 1}}>
          Save
        </Button>
      </Box>
    </Modal>
  );
};

export default UpdateUser;




