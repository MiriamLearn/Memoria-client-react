
import { useState } from 'react';
import Login from './components/Login';
import UserAvatar from './components/UserAvatar';
import { UserProvider } from './context/UserContext';
import { Box } from '@mui/material';
import { Register } from './components/Registration';
// import FileUploader from './components/Files/FileUpLoader';
import {  RouterProvider} from 'react-router-dom';
// import ShowFiles from './components/Files/showFiles';
// import AlbumList from './components/Folders/AlbumList';
// import AlbumPage from './components/Folders/AlbumPage';
import Router from './components/Router';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
      <UserProvider>
        {isLoggedIn ? (
          <>
            {/* אם המשתמש מחובר, מציגים את האווטאר, האלבומים ועוד */}
            <Box display="flex" sx={{ mt: 8 }}>
              <UserAvatar />
            </Box>
            <RouterProvider router={Router} />
          </>
        ) : (
          /* אם המשתמש לא מחובר, מציגים את עמוד ההתחברות */
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '22px' }}>
            <Login onLoginSuccess={handleLoginSuccess} />
            <Register />
          </Box>
        )}
      </UserProvider>
  );
}

export default App;