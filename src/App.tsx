
import { useState } from 'react';
import Login from './components/Login'
import UserAvatar from './components/UserAvatar'
import { UserProvider } from './context/UserContext'
import { Box } from '@mui/material';
import { Register } from './components/Registration';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
 
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <>
  
      <UserProvider>
        {isLoggedIn?(
          <>
          <Box display="flex"sx={{ mt: 8 }}>
            <UserAvatar />
          </Box>
          </>
        ):(
          <>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' ,marginTop:'22px'}}>
            <Login onLoginSuccess={handleLoginSuccess} />
            <Register />
          </Box>
          </>
        )}
    

    </UserProvider>
 

    </>
  )
}

export default App
