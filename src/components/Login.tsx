// import { useContext, useState } from 'react';
// import {
//   Button,
//   Modal,
//   Box,
//   TextField,
//   Typography,
// } from '@mui/material';
// import UserContext from '../context/UserContext';
// import axios from 'axios';
// import ErrorSnackbar from './Error';

// export const Login = ({ onLoginSuccess }: { onLoginSuccess: () => void }) => {
//   const context = useContext(UserContext);
//   if (!context) {
//     throw new Error('Your Component must be used within a UserProvider');
//   }
//   const { dispatch } = context;
//   const [open, setOpen] = useState(false);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('')
//   const [error, setError] = useState<any>(null);
//   const [openSnackbar, setOpenSnackbar] = useState(false);


//   const handleLogin = async () => {
//     try {
//       const res = await axios.post('https://localhost:7251/api/User/login', {
//         email: email,
//         password: password
//       });
//       dispatch({
//         type: 'CREATE_USER',
//         payload: res.data.user
//       });
//       console.log('Full response:', res);
//       console.log('Response data:', res.data);
//       console.log('Response data user:', res.data.user);
//       console.log(res.data.success);


//       if (res.data.token) {
//         localStorage.setItem('token', res.data.token);
//       }


//       if (res.data.success) {
//         //the 4 nexy line from sari
//         localStorage.setItem('userId', res.data.user.id); // שמירת ה-userId
//         localStorage.setItem('formData', JSON.stringify({
//           email: email || "undefined",
//           password: password || "undefined"
//         }));


//         alert('Login successful!');
//         setOpen(false);
//         onLoginSuccess();
//       } else {
//         alert("You can't login");
//       }
//     } catch (error: any) {
//       setError(error);
//       setOpenSnackbar(true);
//     }
//   }

//   return (
//     <>
//       <Button
//         variant="contained"
//         onClick={() => setOpen(true)}
//         sx={{
//           backgroundColor: '#f49b85',
//           color: 'white',
//           paddingX: 4, // מרחיב את הצדדים (left/right)
//           paddingY: 2, // מגדיל את הגובה (top/bottom)
//           fontSize: '1.1rem', // מגדיל את הגופן
//           fontWeight: 'bold', // מדגיש
//           borderRadius: 2,
//           zIndex: 1300,
//           '&:hover': {
//             backgroundColor: '#e98971',
//           },
//         }}
//       >
//         Login
//       </Button>
//       <Modal open={open} onClose={() => setOpen(false)}>
//         <Box sx={{ p: 3, bgcolor: 'white', margin: 'auto', width: 300, mt: 10 }}>
//           <Typography variant="h6" sx={{color:'#f49b85', fontWeight: 'bold',fontFamily: 'Segoe UI'}}>Login</Typography>
//           <TextField
//             label="Email"
//             fullWidth
//             margin="normal"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             sx={{
//               '& label': { color: '#f49b85' },
//               '& label.Mui-focused': { color: '#f49b85' },
//               '& .MuiOutlinedInput-root': {
//                 '& fieldset': { borderColor: '#f49b85' },
//                 '&:hover fieldset': { borderColor: '#f49b85' },
//                 '&.Mui-focused fieldset': { borderColor: '#f49b85' },
//               },
//             }}
//           />
//           <TextField
//             label="Password"
//             fullWidth
//             margin="normal"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             sx={{
//               '& label': { color: '#f49b85' },
//               '& label.Mui-focused': { color: '#f49b85' },
//               '& .MuiOutlinedInput-root': {
//                 '& fieldset': { borderColor: '#f49b85' },
//                 '&:hover fieldset': { borderColor: '#f49b85' },
//                 '&.Mui-focused fieldset': { borderColor: '#f49b85' },
//               },
//             }}
//           />
//           <Button variant="contained" onClick={handleLogin} sx={{ backgroundColor: '#f49b85', color: 'white', padding: 1 }}>
//             Submit
//           </Button>
//         </Box>
//       </Modal>
//       <ErrorSnackbar error={error} open={openSnackbar} onClose={() => setOpenSnackbar(false)} />
//     </>
//   );
// };


import { useContext, useState } from "react"
import { Button, Modal, Box, TextField, Typography } from "@mui/material"
import UserContext from "../context/UserContext"
import axios from "axios"
import ErrorSnackbar from "./Error"
import type { User } from "../reducer/UserReducer"

// טיפוסים לתשובות API
interface LoginResponse {
  success: boolean
  user: User
  token: string
  message?: string
}

export const Login = ({ onLoginSuccess }: { onLoginSuccess: () => void }) => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("Your Component must be used within a UserProvider")
  }
  const { dispatch } = context
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<any>(null)
  const [openSnackbar, setOpenSnackbar] = useState(false)

  const handleLogin = async () => {
    try {
      const res = await axios.post<LoginResponse>("https://localhost:7251/api/User/login", {
        email: email,
        password: password,
      })

      dispatch({
        type: "CREATE_USER",
        payload: res.data.user,
      })

      console.log("Full response:", res)
      console.log("Response data:", res.data)
      console.log("Response data user:", res.data.user)
      console.log(res.data.success)

      if (res.data.token) {
        localStorage.setItem("token", res.data.token)
      }

      if (res.data.success) {
        // שמירת ה-userId
        localStorage.setItem("userId", res.data.user.id.toString())
        localStorage.setItem(
          "formData",
          JSON.stringify({
            email: email || "undefined",
            password: password || "undefined",
          }),
        )

        alert("Login successful!")
        setOpen(false)
        onLoginSuccess()
      } else {
        alert("You can't login")
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
        Login
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{ p: 3, bgcolor: "white", margin: "auto", width: 300, mt: 10 }}>
          <Typography variant="h6" sx={{ color: "#f49b85", fontWeight: "bold", fontFamily: "Segoe UI" }}>
            Login
          </Typography>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          <Button
            variant="contained"
            onClick={handleLogin}
            sx={{ backgroundColor: "#f49b85", color: "white", padding: 1, mt: 2 }}
          >
            Submit
          </Button>
        </Box>
      </Modal>
      <ErrorSnackbar error={error} open={openSnackbar} onClose={() => setOpenSnackbar(false)} />
    </>
  )
}

export default Login


