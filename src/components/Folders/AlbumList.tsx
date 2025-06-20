import { useReducer, useEffect, useState } from "react"
import axios from "axios"
import { albumReducer, initialAlbumState, type Album } from "../../reducer/AlbumReducer"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  CardActionArea,
  Box,
  CardMedia,
  IconButton,
  Tooltip,
  Skeleton,
  Chip,
  Divider,
} from "@mui/material"
import { useNavigate } from "react-router-dom"
import { Plus, Pencil, Trash2, ImageIcon, AlertCircle, FolderPlus, Palette, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"

// הגדרת צבעים מותאמים אישית
const CUSTOM_COLOR = "#f49b85" // צבע כתום-ורוד
const CUSTOM_COLOR_LIGHT = "rgba(244, 155, 133, 0.15)" // גרסה שקופה של אותו צבע

const AlbumList = () => {
  const [albums, dispatch] = useReducer(albumReducer, initialAlbumState)
  const [loading, setLoading] = useState(true)
  const [newAlbumName, setNewAlbumName] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null)
  const [updatedName, setUpdatedName] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [albumToDelete, setAlbumToDelete] = useState<Album | null>(null)
  const token = localStorage.getItem("token")
  const navigate = useNavigate()

  useEffect(() => {
    fetchAlbums()
  }, [])

  const fetchAlbums = async () => {
    try {
      const response = await axios.get<Album[]>("https://memoria-api-pukg.onrender.com/api/album", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      console.log("Albums data structure:", response.data)

      // בקש מידע מפורט על כל אלבום בנפרד
      const albumsWithDetails = await Promise.all(
        response.data.map(async (album: Album) => {
          try {
            const detailResponse = await axios.get<Album>(`https://memoria-api-pukg.onrender.com/api/album/${album.id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            console.log(`Album ${album.id} details:`, detailResponse.data)

            // סנן רק תמונות פעילות
            const activeImages = detailResponse.data.imageList?.filter((image) => !image.isDeleted) || []

            return {
              ...detailResponse.data,
              imageList: activeImages,
            }
          } catch (error) {
            console.error(`Error fetching details for album ${album.id}:`, error)
            return album
          }
        }),
      )

      console.log("Albums with details:", albumsWithDetails)
      dispatch({ type: "SET_ALBUMS", payload: albumsWithDetails })
    } catch (error) {
      console.error("שגיאה בטעינת האלבומים:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddAlbum = async () => {
    if (!newAlbumName.trim()) {
      alert("שם האלבום לא יכול להיות ריק!")
      return
    }

    const newAlbum = {
      name: newAlbumName,
      imageList: [],
      userId: Number(localStorage.getItem("userId")) || 0,
    }

    try {
      const response = await axios.post<Album>("https://memoria-api-pukg.onrender.com/api/album", newAlbum, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      dispatch({ type: "CREATE_ALBUM", payload: response.data })
      handleCloseDialog()
    } catch (error) {
      console.error("שגיאה בהוספת אלבום חדש:", error)
    }
  }

  const handleUpdateAlbum = async (albumId: number, newName: string, album: Album) => {
    try {
      const updatedAlbum: Album = {
        ...album,
        name: newName,
      }

      await axios.put<Album>(`https://memoria-api-pukg.onrender.com/api/album/${albumId}`, updatedAlbum, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      dispatch({ type: "UPDATE_ALBUM", payload: updatedAlbum })
    } catch (error) {
      console.error("שגיאה בעדכון האלבום:", error)
    }
  }

  const handleEditClick = (album: Album) => {
    setEditingAlbum(album)
    setUpdatedName(album.name)
  }

  const handleSaveClick = () => {
    if (editingAlbum) {
      handleUpdateAlbum(editingAlbum.id, updatedName, editingAlbum)
      setEditingAlbum(null)
      setUpdatedName("")
    }
  }

  const handleCloseDialog2 = () => {
    setEditingAlbum(null)
    setUpdatedName("")
  }

  const handleDeleteAlbum = async (albumId: number) => {
    try {
      await axios.delete(`https://memoria-api-pukg.onrender.com/api/album/${albumId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      dispatch({ type: "DELETE_ALBUM", payload: albumId })
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        alert("לא ניתן למחוק אלבום שמכיל תמונות!")
      } else {
        console.error("שגיאה במחיקת האלבום:", error)
        alert("שגיאה במחיקת האלבום. נסה שוב מאוחר יותר.")
      }
    }
  }

  const confirmDeleteAlbum = async (albumId: number) => {
    try {
      const response = await axios.get<Album>(`https://memoria-api-pukg.onrender.com/api/album/${albumId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const fullAlbum: Album = response.data

      // Filter out deleted images for accurate count
      const activeImages = fullAlbum.imageList?.filter((image) => !image.isDeleted) || []
      const albumWithFilteredImages = {
        ...fullAlbum,
        imageList: activeImages,
      }

      setAlbumToDelete(albumWithFilteredImages)
      setDeleteDialogOpen(true)
    } catch (error) {
      console.error("שגיאה בטעינת פרטי האלבום:", error)
      alert("אירעה שגיאה בטעינת פרטי האלבום. נסה שוב מאוחר יותר.")
    }
  }

  const handleOpenDialog = () => {
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setNewAlbumName("")
  }

  const handleAlbumClick = (albumId: number) => {
    navigate(`/albums/${albumId}`)
  }

  // פונקציה חדשה לניווט לקולאז'ים
  const handleCollageClick = (albumId: number) => {
    navigate(`/albums/${albumId}/collage`)
  }

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
          <Skeleton width={200} sx={{ mx: "auto" }} />
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Box
              key={item}
              sx={{
                flex: "0 0 auto",
                width: {
                  xs: "calc(100% - 24px)",
                  sm: "calc(50% - 24px)",
                  md: "calc(33.33% - 24px)",
                },
              }}
            >
              <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
              <Skeleton height={30} width="60%" sx={{ mt: 1 }} />
              <Skeleton height={40} width="100%" sx={{ mt: 1 }} />
            </Box>
          ))}
        </Box>
      </Box>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Box sx={{ p: 3 }}>

        {/* קישור לעמוד הבית */}
        <Box sx={{ mb: 2 }}>
          <Typography
            component="button"
            onClick={() => navigate("/")}
            sx={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              fontSize: "1.1rem", // אפשר גם '18px' או '20px'
              fontWeight: "bold", // או "500" אם את רוצה פחות מודגש
              fontFamily: "'Segoe UI', sans-serif", // או כל גופן אחר מועדף
              "&:hover": {
                color: "#df8670",
              },
            }}
          >
            <ArrowLeft size={18} style={{ marginLeft: 6 }} />
            חזרה לעמוד הבית
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Typography variant="h4" fontWeight="bold">
            האלבומים שלי
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<FolderPlus size={18} />}
            onClick={handleOpenDialog}
            sx={{ borderRadius: 8, backgroundColor: "#f49b85" }}
          >
            אלבום חדש
          </Button>
        </Box>

        {albums.length === 0 ? (
          <Card sx={{ p: 4, textAlign: "center", borderRadius: 4 }}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <ImageIcon size={64} color="#f49b85" />
              <Typography variant="h6">אין אלבומים עדיין</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                צור את האלבום הראשון שלך כדי להתחיל לשמור זכרונות
              </Typography>
              <Button
                variant="contained"
                startIcon={<Plus size={18} />}
                sx={{ backgroundColor: "#f49b85" }}
                onClick={handleOpenDialog}
              >
                צור אלבום חדש
              </Button>
            </Box>
          </Card>
        ) : (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
            {albums.map((album, index) => (
              <Box
                key={album.id}
                sx={{
                  flex: "0 0 auto",
                  width: {
                    xs: "calc(100% - 24px)",
                    sm: "calc(50% - 24px)",
                    md: "calc(33.33% - 24px)",
                  },
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "transform 0.3s, box-shadow 0.3s",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                      },
                    }}
                  >
                    <CardActionArea onClick={() => handleAlbumClick(album.id)} sx={{ flexGrow: 1 }}>
                      <CardMedia
                        component="div"
                        sx={{
                          height: 200,
                          backgroundColor: album.imageList?.length ? "transparent" : CUSTOM_COLOR_LIGHT,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {album.imageList && album.imageList.length > 0 ? (
                          <img
                            src={album.imageList[0].s3URL || "/placeholder.svg"}
                            alt={album.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                            onError={(e) => {
                              console.log("Image failed to load:", album.imageList[0])
                              // Fallback to placeholder if image fails to load
                              e.currentTarget.style.display = "none"
                              e.currentTarget.parentElement!.innerHTML = `
                                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: ${CUSTOM_COLOR}; background-color: ${CUSTOM_COLOR_LIGHT};">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                                </svg>
                                <span style="margin-top: 8px; font-size: 12px; font-weight: 500;">תמונה לא זמינה</span>
                              </div>
                            `
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              height: "100%",
                              color: CUSTOM_COLOR,
                              gap: 1,
                            }}
                          >
                            <ImageIcon size={64} />
                            <Typography variant="caption" color="inherit" fontWeight="medium">
                              אלבום ריק
                            </Typography>
                          </Box>
                        )}
                      </CardMedia>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" component="h3" fontWeight="bold" gutterBottom>
                          {album.name}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                          <Chip
                            label={`${Array.isArray(album.imageList) ? album.imageList.length : 0} תמונות`}
                            size="small"
                            color={Array.isArray(album.imageList) && album.imageList.length > 0 ? "primary" : "default"}
                            variant="outlined"
                            sx={{
                              color: "#f49b85",
                              borderColor: "#f49b85",
                              fontWeight: "bold",
                              "& .MuiChip-icon": {
                                color: "#f49b85",
                              },
                            }}
                          />
                        </Box>
                      </CardContent>
                    </CardActionArea>
                    <Divider />

                    {/* כאן השינוי העיקרי - הוספת כפתור הקולאז'ים */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", p: 1 }}>
                      <Tooltip title="צפה באלבום">
                        <Button
                          size="small"
                          onClick={() => handleAlbumClick(album.id)}
                          sx={{ flex: 1, color: "#f49b85" }}
                        >
                          צפה באלבום
                        </Button>
                      </Tooltip>

                      {/* כפתור חדש לקולאז'ים */}
                      <Tooltip
                        title={album.imageList && album.imageList.length >= 2 ? "צור קולאז'" : "נדרשות לפחות 2 תמונות"}
                      >
                        <span>
                          <Button
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCollageClick(album.id)
                            }}
                            disabled={!album.imageList || album.imageList.length < 2}
                            sx={{
                              flex: 1,
                              color: album.imageList && album.imageList.length >= 2 ? "#f49b85" : "text.disabled",
                              ml: 0.5,
                              mr: 0.5,
                            }}
                            startIcon={<Palette size={14} />}
                          >
                            קולאז'
                          </Button>
                        </span>
                      </Tooltip>

                      <Tooltip title="ערוך">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditClick(album)
                          }}
                        >
                          <Pencil size={18} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="מחק">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation()
                            confirmDeleteAlbum(album.id)
                          }}
                        >
                          <Trash2 size={18} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Card>
                </motion.div>
              </Box>
            ))}
          </Box>
        )}

        {/* Add Album Dialog */}
        <Dialog
          open={isDialogOpen}
          onClose={handleCloseDialog}
          PaperProps={{
            sx: { borderRadius: 3, p: 1 },
          }}
        >
          <DialogTitle sx={{ fontWeight: "bold" }}>הוסף אלבום חדש</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="שם האלבום"
              type="text"
              fullWidth
              value={newAlbumName}
              onChange={(e) => setNewAlbumName(e.target.value)}
              variant="outlined"
              sx={{
                mt: 1,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#f49b85",
                  },
                  "&:hover fieldset": {
                    borderColor: "#f49b85",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#f49b85",
                  },
                },
                "& label.Mui-focused": {
                  color: "#f49b85",
                },
              }}
              InputLabelProps={{
                sx: { color: "#f49b85" },
              }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCloseDialog} color="inherit">
              ביטול
            </Button>
            <Button
              onClick={handleAddAlbum}
              variant="contained"
              disabled={!newAlbumName.trim()}
              sx={{
                backgroundColor: "#f49b85",
                "&:hover": {
                  backgroundColor: "#e68a76",
                },
              }}
            >
              הוסף
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Album Dialog */}
        <Dialog
          open={Boolean(editingAlbum)}
          onClose={handleCloseDialog2}
          PaperProps={{
            sx: { borderRadius: 3, p: 1 },
          }}
        >
          <DialogTitle sx={{ fontWeight: "bold" }}>עריכת אלבום</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="שם האלבום"
              type="text"
              fullWidth
              value={updatedName}
              onChange={(e) => setUpdatedName(e.target.value)}
              variant="outlined"
              sx={{
                mt: 1,
                "& label": {
                  color: "#f49b85",
                },
                "& label.Mui-focused": {
                  color: "#f49b85",
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#f49b85",
                  },
                  "&:hover fieldset": {
                    borderColor: "#f49b85",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#f49b85",
                  },
                },
              }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCloseDialog2} color="inherit">
              ביטול
            </Button>
            <Button
              onClick={handleSaveClick}
              variant="contained"
              disabled={!updatedName.trim()}
              sx={{ backgroundColor: "#f49b85", "&:hover": { backgroundColor: "#e98974" } }}
            >
              שמור
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          PaperProps={{
            sx: { borderRadius: 3, p: 1 },
          }}
        >
          <DialogTitle sx={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: 1 }}>
            <AlertCircle size={20} color="#f43f5e" />
            אישור מחיקת אלבום
          </DialogTitle>
          <DialogContent>
            <Typography>
              {albumToDelete?.imageList?.length
                ? `האלבום "${albumToDelete.name}" מכיל ${albumToDelete.imageList.length} תמונות. האם אתה בטוח שברצונך למחוק אותו?`
                : `האם אתה בטוח שברצונך למחוק את האלבום "${albumToDelete?.name}"?`}
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">
              ביטול
            </Button>
            <Button
              onClick={() => {
                if (albumToDelete) {
                  handleDeleteAlbum(albumToDelete.id)
                }
                setDeleteDialogOpen(false)
              }}
              color="error"
              variant="contained"
            >
              מחק
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </motion.div>
  )
}

export default AlbumList
