import { useContext, useState } from 'react';
import {
    Button,
    Modal,
    Box,
    TextField,
} from '@mui/material';
import UserContext from '../context/UserContext';
import axios from 'axios';
import ErrorSnackbar from './Error';
export const Register = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('Your Component must be used within a UserProvider');
    }
    const { dispatch } = context;
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        Name: '',  email: '',
        password: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [error, setError] = useState<any>(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const handleSave = async () => {
        try {
            console.log(formData);
            const res = await axios.post('https://localhost:7251/api/User',
                {
                    email: formData.email,
                    password: formData.password,
                    Name: formData.Name, 
                });
            console.log('Full response:', res);
            console.log('Response data:', res.data);
            if (res.data.success) {
                dispatch({
                    type: 'CREATE_USER',
                    payload: res.data.user,
                });
                alert('Registration successful!');
                setFormData({
                    Name: '', email: '', password: '',
                });
                setOpen(false);
            } else {
                setErrorMessage(res.data.message || 'Registration failed. Please try again.');
            }
        } catch (error: any) {
            setError(error);
            setOpenSnackbar(true);
        }
    };
    return (
        <>
            <Button variant="contained" onClick={() => setOpen(true)} sx={{ backgroundColor: '#b7a710', color: 'white', padding: 1, zIndex: 1300 }}>
                Register
            </Button>
            <Modal open={open} onClose={() => setOpen(false)}>
                <Box
                    sx={{
                        padding: 2,
                        maxWidth: 400,
                        margin: 'auto',
                        marginTop: '8%',
                        backgroundColor: 'white',
                        borderRadius: 2,
                    }}
                >
                    {Object.keys(formData).map((key) => (
                        <TextField
                            key={key}
                            label={key.charAt(0).toUpperCase() + key.slice(1)}
                            fullWidth
                            margin="normal"
                            value={formData[key as keyof typeof formData]}
                            onChange={(e) =>
                                setFormData({ ...formData, [key]: e.target.value })
                            }

                        />
                    ))}
                    {errorMessage && (
                        <Box sx={{ color: 'red', marginBottom: 2 }}>{errorMessage}</Box>
                    )}
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        sx={{ backgroundColor: '#b7a710', color: 'white', padding: 1 }}
                    >
                        Save
                    </Button>
                </Box>
            </Modal>
            <ErrorSnackbar error={error} open={openSnackbar} onClose={() => setOpenSnackbar(false)} />
        </>
    );
}