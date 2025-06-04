// import { useContext, useState } from 'react';
// import {
//     Button,
//     Modal,
//     Box,
//     TextField,
// } from '@mui/material';
// import UserContext from '../context/UserContext';
// import axios from 'axios';
// import ErrorSnackbar from './Error';
// export const Register = () => {
//     const context = useContext(UserContext);
//     if (!context) {
//         throw new Error('Your Component must be used within a UserProvider');
//     }
//     const { dispatch } = context;
//     const [open, setOpen] = useState(false);
//     const [formData, setFormData] = useState({
//         Name: '', email: '',
//         password: ''
//     });
//     const [errorMessage, setErrorMessage] = useState('');
//     const [error, setError] = useState<any>(null);
//     const [openSnackbar, setOpenSnackbar] = useState(false);
//     const handleSave = async () => {
//         try {
//             console.log(formData);
//             const res = await axios.post('https://localhost:7251/api/User',
//                 {
//                     email: formData.email,
//                     password: formData.password,
//                     Name: formData.Name,
//                 });
//             console.log('Full response:', res);
//             console.log('Response data:', res.data);
//             if (res.data.success) {
//                 dispatch({
//                     type: 'CREATE_USER',
//                     payload: res.data.user,
//                 });
//                 alert('Registration successful!');
//                 setFormData({
//                     Name: '', email: '', password: '',
//                 });
//                 setOpen(false);
//             } else {
//                 setErrorMessage(res.data.message || 'Registration failed. Please try again.');
//             }
//         } catch (error: any) {
//             setError(error);
//             setOpenSnackbar(true);
//         }
//     };
//     return (
//         <>
//             <Button variant="contained" onClick={() => setOpen(true)}
//                 sx={{
//                     backgroundColor: '#f49b85',
//                     color: 'white',
//                     paddingX: 4, // מרחיב את הצדדים (left/right)
//                     paddingY: 2, // מגדיל את הגובה (top/bottom)
//                     fontSize: '1.1rem', // מגדיל את הגופן
//                     fontWeight: 'bold', // מדגיש
//                     borderRadius: 2,
//                     zIndex: 1300,
//                     '&:hover': {
//                         backgroundColor: '#e98971',
//                     },
//                 }}>
//                 Register
//             </Button>
//             <Modal open={open} onClose={() => setOpen(false)}>
//                 <Box
//                     sx={{
//                         padding: 2,
//                         maxWidth: 400,
//                         margin: 'auto',
//                         marginTop: '8%',
//                         backgroundColor: 'white',
//                         borderRadius: 2,
//                     }}
//                 >
//                     {Object.keys(formData).map((key) => (
//                         <TextField
//                             key={key}
//                             label={key.charAt(0).toUpperCase() + key.slice(1)}
//                             fullWidth
//                             margin="normal"
//                             value={formData[key as keyof typeof formData]}
//                             onChange={(e) =>
//                                 setFormData({ ...formData, [key]: e.target.value })
//                             }
//                             sx={{
//                                 '& label': { color: '#f49b85' },
//                                 '& label.Mui-focused': { color: '#f49b85' },
//                                 '& .MuiOutlinedInput-root': {
//                                     '& fieldset': { borderColor: '#f49b85' },
//                                     '&:hover fieldset': { borderColor: '#f49b85' },
//                                     '&.Mui-focused fieldset': { borderColor: '#f49b85' },
//                                 },
//                             }}

//                         />
//                     ))}
//                     {errorMessage && (
//                         <Box sx={{ color: 'red', marginBottom: 2 }}>{errorMessage}</Box>
//                     )}
//                     <Button
//                         onClick={handleSave}
//                         variant="contained"
//                         sx={{ backgroundColor: '#f49b85', color: 'white', padding: 1 }}
//                     >
//                         Save
//                     </Button>
//                 </Box>
//             </Modal>
//             <ErrorSnackbar error={error} open={openSnackbar} onClose={() => setOpenSnackbar(false)} />
//         </>
//     );
// }


// export default Register;



import { useContext, useState } from "react"
import { Button, Modal, Box, TextField, Typography } from "@mui/material"
import UserContext from "../context/UserContext"
import axios from "axios"
import ErrorSnackbar from "./Error"
import type { User } from "../reducer/UserReducer"

// טיפוסים לתשובות API
interface RegisterResponse {
  success: boolean
  user: User
  message?: string
}

export const Register = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("Your Component must be used within a UserProvider")
  }
  const { dispatch } = context
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    Name: "",
    email: "",
    password: "",
  })
  const [errorMessage, setErrorMessage] = useState("")
  const [error, setError] = useState<any>(null)
  const [openSnackbar, setOpenSnackbar] = useState(false)

  const handleSave = async () => {
    try {
      console.log(formData)
      const res = await axios.post<RegisterResponse>("https://localhost:7251/api/User", {
        email: formData.email,
        password: formData.password,
        Name: formData.Name,
      })

      console.log("Full response:", res)
      console.log("Response data:", res.data)

      if (res.data.success) {
        dispatch({
          type: "CREATE_USER",
          payload: res.data.user,
        })
        alert("Registration successful!")
        setFormData({
          Name: "",
          email: "",
          password: "",
        })
        setOpen(false)
      } else {
        setErrorMessage(res.data.message || "Registration failed. Please try again.")
      }
    } catch (error: any) {
      setError(error)
      setOpenSnackbar(true)
    }
  }

  return (
    <>
      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        sx={{
          backgroundColor: "#f49b85",
          color: "white",
          paddingX: 4,
          paddingY: 2,
          fontSize: "1.1rem",
          fontWeight: "bold",
          borderRadius: 2,
          zIndex: 1300,
          "&:hover": {
            backgroundColor: "#e98971",
          },
        }}
      >
        Register
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            padding: 2,
            maxWidth: 400,
            margin: "auto",
            marginTop: "8%",
            backgroundColor: "white",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" sx={{ color: "#f49b85", fontWeight: "bold", fontFamily: "Segoe UI", mb: 2 }}>
            Register
          </Typography>
          {Object.keys(formData).map((key) => (
            <TextField
              key={key}
              label={key.charAt(0).toUpperCase() + key.slice(1)}
              type={key === "password" ? "password" : "text"}
              fullWidth
              margin="normal"
              value={formData[key as keyof typeof formData]}
              onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
              sx={{
                "& label": { color: "#f49b85" },
                "& label.Mui-focused": { color: "#f49b85" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#f49b85" },
                  "&:hover fieldset": { borderColor: "#f49b85" },
                  "&.Mui-focused fieldset": { borderColor: "#f49b85" },
                },
              }}
            />
          ))}
          {errorMessage && (
            <Box sx={{ color: "red", marginBottom: 2, mt: 1 }}>
              <Typography variant="body2" color="error">
                {errorMessage}
              </Typography>
            </Box>
          )}
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{ backgroundColor: "#f49b85", color: "white", padding: 1, mt: 2 }}
          >
            Save
          </Button>
        </Box>
      </Modal>
      <ErrorSnackbar error={error} open={openSnackbar} onClose={() => setOpenSnackbar(false)} />
    </>
  )
}

export default Register