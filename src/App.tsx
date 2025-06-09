//------------------------good version without homePage
// import { useState } from "react"
// import { Login } from "./components/Login"
// import UserAvatar from "./components/UserAvatar"
// import { UserProvider } from "./context/UserContext"
// import { Box, Container, ThemeProvider, createTheme, Typography } from "@mui/material"
// import { Register } from "./components/Registration"
// import { RouterProvider } from "react-router-dom"
// import Router from "./components/Router"
// import { motion } from "framer-motion"

// const theme = createTheme({
//   direction: "rtl",
//   palette: {
//     primary: {
//       main: "#6366f1",
//       dark: "#4f46e5",
//       light: "#818cf8",
//     },
//     secondary: {
//       main: "#ec4899",
//       dark: "#db2777",
//       light: "#f472b6",
//     },
//     background: {
//       default: "#fdf5f0", // בז’ בהיר כמו בלוגו
//       paper: "#ffffff",
//     },
//   },
//   typography: {
//     fontFamily: '"Heebo", "Roboto", "Arial", sans-serif',
//   },
//   components: {
//     MuiButton: {
//       styleOverrides: {
//         root: {
//           borderRadius: 8,
//           textTransform: "none",
//           fontWeight: 600,
//         },
//       },
//     },
//     MuiCard: {
//       styleOverrides: {
//         root: {
//           borderRadius: 12,
//           boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
//         },
//       },
//     },
//   },
// })

// function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false)

//   const handleLoginSuccess = () => {
//     setIsLoggedIn(true)
//   }

//   const handleLogout = () => {
//     localStorage.removeItem("token")
//     localStorage.removeItem("userId")
//     setIsLoggedIn(false)
//   }

//   return (
//     <ThemeProvider theme={theme}>
//       <Box sx={{  minHeight: "100vh" }}>
//         <UserProvider>
//           <Container maxWidth="lg" sx={{ flexGrow: 1, py: 4 }}>
//             {isLoggedIn ? (
//               <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
//                 <Box
//                   sx={{
//                     display: "flex",
//                     flexDirection: "column",
//                     minHeight: "100vh",
//                   }}
//                 >
//                   <Box
//                     sx={{
//                       display: "flex",
//                       justifyContent: "flex-start",
//                       mb: 4,
//                       position: "sticky",
//                       top: 0,
//                       zIndex: 1100,
//                       // backgroundColor: "background.default",
//                       py: 2,
//                       borderBottom: "1px solid",
//                       borderColor: "divider",
//                     }}
//                   >
//                     <UserAvatar onLogout={handleLogout} />
//                   </Box>
//                   <Box sx={{ flexGrow: 1 }}>
//                     <RouterProvider router={Router} />
//                   </Box>
//                 </Box>
//               </motion.div>
//             ) : (
//               <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
//                 <Box
//                   sx={{
//                     display: "flex",
//                     flexDirection: "column",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     gap: 4,
//                     minHeight: "80vh",
//                   }}
//                 >
//                   {/* Logo Section */}
//                   <Box
//                     sx={{
//                       display: "flex",
//                       flexDirection: "column",
//                       alignItems: "center",
//                       mb: 4,
//                     }}
//                   >
//                     <img
//                       // src="/src/assets/memoria2.png"
//                       src="/memoria2.png"
//                       alt="Memoria Logo"
//                       style={{
//                         width: "400px",
//                         height: "320px",
//                         objectFit: "contain",
//                         marginBottom: "16px",
//                       }}
//                     />
//                     {/* <Typography variant="subtitle1" color="text.secondary" textAlign="center">
//                       שומרים רגעים, יוצרים זיכרונות
//                     </Typography> */}
//                     <Typography
//                       variant="h5" // מגדיל את הגופן
//                       fontWeight="bold" // מדגיש
//                       color="#f49b85"
//                       textAlign="center"
//                     >
//                       שומרים רגעים, יוצרים זיכרונות
//                     </Typography>
//                   </Box>

//                   {/* Login/Register Forms */}
//                   <Box
//                     sx={{
//                       display: "flex",
//                       flexDirection: { xs: "column", sm: "row" },
//                       alignItems: "center",
//                       justifyContent: "center",
//                       gap: 4,
//                     }}
//                   >
//                     <Login onLoginSuccess={handleLoginSuccess} />
//                     <Register />
//                   </Box>
//                 </Box>
//               </motion.div>
//             )}
//           </Container>
//         </UserProvider>
//       </Box>
//     </ThemeProvider>
//   )
// }

// export default App




///////+++++++++++++++++version with HomePage
import { useState } from "react"
import { Login } from "./components/Login"
import { UserProvider } from "./context/UserContext"
import { Box, Container, ThemeProvider, createTheme, Typography } from "@mui/material"
import { Register } from "./components/Registration"
import { RouterProvider } from "react-router-dom"
import Router from "./components/Router"
import { motion } from "framer-motion"

const theme = createTheme({
  direction: "rtl",
  palette: {
    primary: {
      main: "#6366f1",
      dark: "#4f46e5",
      light: "#818cf8",
    },
    secondary: {
      main: "#ec4899",
      dark: "#db2777",
      light: "#f472b6",
    },
    background: {
      default: "#fdf5f0",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: '"Heebo", "Roboto", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        },
      },
    },
  },
})

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLoginSuccess = () => {
    setIsLoggedIn(true)
  }

  // const handleLogout = () => {
  //   localStorage.removeItem("token")
  //   localStorage.removeItem("userId")
  //   setIsLoggedIn(false)
  // }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: "100vh" }}>
        <UserProvider>
          <Container maxWidth="lg" sx={{ flexGrow: 1, py: 4 }}>
            {isLoggedIn ? (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
              >
                <RouterProvider router={Router} />
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                    minHeight: "80vh",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      mb: 4,
                    }}
                  >
                    <img
                      src="/memoria2.png"
                      alt="Memoria Logo"
                      style={{
                        width: "400px",
                        height: "320px",
                        objectFit: "contain",
                        marginBottom: "16px",
                      }}
                    />
                    <Typography variant="h5" fontWeight="bold" color="#f49b85" textAlign="center">
                      שומרים רגעים, יוצרים זיכרונות
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 4,
                    }}
                  >
                    <Login onLoginSuccess={handleLoginSuccess} />
                    <Register />
                  </Box>
                </Box>
              </motion.div>
            )}
          </Container>
        </UserProvider>
      </Box>
    </ThemeProvider>
  )
}

export default App
