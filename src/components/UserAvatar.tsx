import React, { useContext, useState } from 'react';
import {
  Avatar,
  Button,
  Typography,
  Box,
} from '@mui/material';
import UserContext from '../context/UserContext';
import UpdateUser from './UpdateUser';

const UserAvatar: React.FC = () => {
  const { user } = useContext(UserContext);
  console.log('User from context:', user);
  const [open, setOpen] = useState(false);

  return (
    <Box display="flex" alignItems="center" gap={2}zIndex= "1300" marginTop= "-42px" >
      <Avatar sx={{ bgcolor: '#b7a710' }}>{user.name ? user.name[0].toUpperCase() : '?'}</Avatar>
      <Typography sx={{ color: '#80750e',fontSize:'15px' }}>{user.name || 'Guest'}</Typography>
      <Button variant="outlined" sx={{ width: '100%', backgroundColor: '#b7a710', color: 'white', padding: 1 }} onClick={() => setOpen(true)}>
        Update
      </Button>
      {open && <UpdateUser onClose={() => setOpen(false)} />}
    </Box>
  );
};

export default UserAvatar;
