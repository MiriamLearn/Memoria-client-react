///////--------------------good version without homePape
// import type React from "react"
// import { useContext, useState } from "react"
// import { Avatar, Box, Typography, Menu, MenuItem, ListItemIcon, IconButton, Tooltip } from "@mui/material"
// import UserContext from "../context/UserContext"
// import { LogOut } from "lucide-react"

// interface UserAvatarProps {
//   onLogout: () => void
// }

// const UserAvatar: React.FC<UserAvatarProps> = ({ onLogout }) => {
//   const { user } = useContext(UserContext)
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
//   const open = Boolean(anchorEl)

//   const handleClick = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorEl(event.currentTarget)
//   }

//   const handleClose = () => {
//     setAnchorEl(null)
//   }

//   const handleLogout = () => {
//     handleClose()
//     onLogout()
//   }

//   return (
//     <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//       <Tooltip title="הגדרות חשבון">
//         <IconButton
//           onClick={handleClick}
//           size="small"
//           sx={{
//             ml: 2,
//             border: "2px solid",
//             borderColor: "#f49b85",
//             transition: "all 0.2s",
//             "&:hover": {
//               backgroundColor: "#f49b85",
//               color: "white",
//             },
//           }}
//           aria-controls={open ? "account-menu" : undefined}
//           aria-haspopup="true"
//           aria-expanded={open ? "true" : undefined}
//         >
//           <Avatar
//             sx={{
//               width: 40,
//               height: 40,
//               // bgcolor: "primary.main",
//               bgcolor: "#f49b85",
//               color: "white",
//               fontWeight: "bold",
//             }}
//           >
//             {user.name ? user.name[0].toUpperCase() : "?"}
//           </Avatar>
//         </IconButton>
//       </Tooltip>
//       <Typography
//         variant="subtitle1"
//         sx={{
//           fontWeight: 600,
//           color: "text.primary",
//           display: { xs: "none", sm: "block" },
//         }}
//       >
//         {user.name || "אורח"}
//       </Typography>

//       <Menu
//         anchorEl={anchorEl}
//         id="account-menu"
//         open={open}
//         onClose={handleClose}
//         onClick={handleClose}
//         PaperProps={{
//           elevation: 0,
//           sx: {
//             overflow: "visible",
//             filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.15))",
//             mt: 1.5,
//             borderRadius: 2,
//             minWidth: 180,
//             "& .MuiAvatar-root": {
//               width: 32,
//               height: 32,
//               ml: -0.5,
//               mr: 1,
//             },
//           },
//         }}
//         transformOrigin={{ horizontal: "right", vertical: "top" }}
//         anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
//       >
//         {/* <MenuItem onClick={handleClose}>
//           <ListItemIcon>
//             <User size={18} />
//           </ListItemIcon>
//           הפרופיל שלי
//         </MenuItem>
//         <MenuItem onClick={handleClose}>
//           <ListItemIcon>
//             <Settings size={18} />
//           </ListItemIcon>
//           הגדרות
//         </MenuItem> */}
//         {/* <Divider /> */}
//         <MenuItem onClick={handleLogout}>
//           <ListItemIcon>
//             <LogOut size={18} color="#f43f5e" style={{ transform: 'rotate(180deg)' }}/>
//           </ListItemIcon>
//           <Typography color="error">התנתק</Typography>
//         </MenuItem>
//       </Menu>
//     </Box>
//   )
// }

// export default UserAvatar



////////++++++++++++++++++++++++++++++homePage
import type React from "react"

import { useState, useContext } from "react"
import { Avatar, Menu, MenuItem, Typography, Divider, ListItemIcon, IconButton, Tooltip, Box } from "@mui/material"
import { LogOut, Home, FolderOpen } from "lucide-react"
import { useNavigate } from "react-router-dom"
import UserContext from "../context/UserContext"

interface UserAvatarProps {
  onLogout: () => void
}

const UserAvatar = ({ onLogout }: UserAvatarProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const navigate = useNavigate()
  // const context = useContext(UserContext)

  const { user } = useContext(UserContext)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    onLogout()
    handleClose()
  }

  const handleNavigateHome = () => {
    navigate("/")
    handleClose()
  }

  const handleNavigateAlbums = () => {
    navigate("/albums")
    handleClose()
  }

  const open = Boolean(anchorEl)

  return (
    <>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5}}>
      <Tooltip title="הגדרות חשבון">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{
            ml: 2,
            border: "2px solid",
            borderColor: "#f49b85",
            transition: "all 0.2s",
            "&:hover": {
              backgroundColor: "#f49b85",
              color: "white",
            },
          }}
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <Avatar
            onClick={handleClick}
            sx={{
              cursor: "pointer",
              backgroundColor: "#f49b85",
              "&:hover": {
                backgroundColor: "#e98971",
              },
            }}
          >
            {user.name ? user.name[0].toUpperCase() : "?"}

            {/* <User size={20} /> */}
          </Avatar>
        </IconButton>
      </Tooltip>



      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 600,
          color: "text.primary",
          display: { xs: "none", sm: "block" },
          mt: 0.6,
        }}
      >
        {user.name || "אורח"}
      </Typography>
      
      </Box>


      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.15))",
            mt: 1.5,
            borderRadius: 2,
            minWidth: 180,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleNavigateHome}>
          <ListItemIcon>
            <Home size={18} color="#f49b85" />
          </ListItemIcon>
          עמוד הבית
        </MenuItem>

        <MenuItem onClick={handleNavigateAlbums}>
          <ListItemIcon>
            <FolderOpen size={18} color="#f49b85" />
          </ListItemIcon>
          האלבומים שלי
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogOut size={18} color="#f43f5e" style={{ transform: "rotate(180deg)" }} />
          </ListItemIcon>
          <Typography color="error">התנתק</Typography>
        </MenuItem>
      </Menu>
    </>
  )
}

export default UserAvatar



















