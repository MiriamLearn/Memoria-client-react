import type React from "react"
import { useReducer, useEffect, useState } from "react"
import axios from "axios"
import { type Image, imageReducer, initialImageState } from "../../reducer/ImageReducer"
import {
  Box,
  Button,
  Typography,
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  Modal,
  IconButton,
  Tooltip,
  Skeleton,
  Breadcrumbs,
  Chip,
  Divider,
  TextField,
  Paper,
} from "@mui/material"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Upload, Trash2, Edit, ImageIcon, Home, Maximize2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// טיפוס לתשובה מהשרת עבור אלבום
interface AlbumResponse {
  id: number
  name: string
  imageList: Image[]
  userId: number
}

// טיפוס לתשובה מהשרת עבור presigned URL
interface PresignedUrlResponse {
  url: string
}

const AlbumPage = () => {
  const { id } = useParams<{ id: string }>()
  const albumId = Number.parseInt(id || "0")
  const navigate = useNavigate()

  const [images, dispatch] = useReducer(imageReducer, initialImageState)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [openModal, setOpenModal] = useState(false)
  const [albumName, setAlbumName] = useState("")
  const [previewImage, setPreviewImage] = useState<Image | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)

  useEffect(() => {
    if (albumId <= 0) {
      console.error("Invalid album ID:", albumId)
      navigate("/albums")
      return
    }
    fetchImages()
  }, [albumId, navigate])

  const fetchImages = async () => {
    try {
      const token = localStorage.getItem("token")

      const response = await axios.get<AlbumResponse>(`https://memoria-api-pukg.onrender.com/api/album/${albumId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setAlbumName(response.data.name)
      // Filter out deleted images
      const imagesData: Image[] = response.data.imageList?.filter((image) => !image.isDeleted) || []
      dispatch({ type: "SET_IMAGES", payload: imagesData })
    } catch (error) {
      console.error("שגיאה בטעינת התמונות:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = () => {
    navigate(`/albums/${albumId}/upload`)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
    } else {
      console.error("לא נבחר קובץ")
    }
  }

  const handleUpdate = async () => {
    if (!selectedFile || selectedImageId === null) return

    try {
      const response = await axios.get<PresignedUrlResponse>("https://memoria-api-pukg.onrender.com/api/upload/presigned-url", {
        params: { imageName: selectedFile.name, albumId: albumId },
      })

      const presignedUrl = response.data.url

      await axios.put(presignedUrl, selectedFile, {
        headers: {
          "Content-Type": selectedFile.type,
        },
      })

      const updatedImage: Partial<Image> & { id: number } = {
        id: selectedImageId,
        name: selectedFile.name,
        s3URL: `https://memoria-bucket-testpnoren.s3.us-east-1.amazonaws.com/${selectedFile.name}`,
        size: selectedFile.size,
        albumId: albumId,
      }

      await axios.put<Image>(`https://memoria-api-pukg.onrender.com/api/image/${selectedImageId}`, updatedImage)

      dispatch({ type: "UPDATE_IMAGE", payload: updatedImage })
      handleCloseModal()
    } catch (error) {
      console.error("שגיאה בעדכון התמונה:", error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm("האם אתה בטוח שברצונך למחוק את התמונה?")) {
      return
    }

    try {
      await axios.delete(`https://memoria-api-pukg.onrender.com/api/image/${id}`)
      dispatch({ type: "DELETE_IMAGE", payload: { id } })
    } catch (error) {
      console.error("שגיאה במחיקת התמונה:", error)
    }
  }

  const handleOpenModal = (id: number) => {
    setSelectedImageId(id)
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
    setSelectedImageId(null)
    setSelectedFile(null)
  }

  const handlePreviewImage = (image: Image) => {
    setPreviewImage(image)
    setPreviewOpen(true)
  }

  // const handleDownloadImage = (image: Image) => {
  //   const link = document.createElement("a")
  //   link.href = image.s3URL
  //   link.download = image.name
  //   document.body.appendChild(link)
  //   link.click()
  //   document.body.removeChild(link)
  // }

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton width={200} height={30} sx={{ mb: 2 }} />
        <Skeleton width={300} height={20} sx={{ mb: 4 }} />
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Box
              key={item}
              sx={{
                flex: "0 0 auto",
                width: {
                  xs: "calc(100% - 16px)",
                  sm: "calc(50% - 16px)",
                  md: "calc(33.33% - 16px)",
                  lg: "calc(25% - 16px)",
                },
              }}
            >
              <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2, mb: 1 }} />
              <Skeleton height={24} width="60%" />
              <Skeleton height={36} width="100%" />
            </Box>
          ))}
        </Box>
      </Box>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ mb: 4 }}>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
          <Typography
              component="button"
              onClick={() => navigate("/")}
              sx={{
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                fontSize: "inherit",
                fontFamily: "inherit",
                "&:hover": {
                  color: "#df8670",
                },
              }}
            >
            <Home size={16} style={{ marginLeft: 4, color: "#df8670" }} />
              עמוד הבית
            </Typography>
            <Typography
              component="button"
              onClick={() => navigate("/albums")}
              sx={{
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                fontSize: "inherit",
                fontFamily: "inherit",
                "&:hover": {
                  color: "#df8670",
                },
              }}
            >
              {/* <Home size={16} style={{ marginLeft: 4, color: "#df8670" }} /> */}
              אלבומים
            </Typography>
            <Typography color="text.primary" fontWeight="medium">
              {albumName}
            </Typography>
          </Breadcrumbs>

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
            <Typography variant="h4" fontWeight="bold">
              {albumName}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ backgroundColor: "#f49b85" }}
              startIcon={<Upload size={18} />}
              onClick={handleUpload}
            >
              העלאת תמונה
            </Button>
          </Box>

          <Chip
            label={`${images.length} תמונות`}
            size="small"
            variant="outlined"
            sx={{ mt: 1, color: "#df8670", borderColor: "#f49b85" }}
          />
        </Box>

        {images.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: "center",
              borderRadius: 4,
              border: "1px dashed",
              borderColor: "divider",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <ImageIcon size={64} color="#f49b85" />
              <Typography variant="h6">אין תמונות באלבום זה</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                התחל להעלות תמונות כדי למלא את האלבום שלך
              </Typography>
              <Button
                variant="contained"
                startIcon={<Upload size={18} />}
                sx={{ backgroundColor: "#f49b85" }}
                onClick={handleUpload}
              >
                העלה תמונה ראשונה
              </Button>
            </Box>
          </Paper>
        ) : (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <AnimatePresence>
              {images.map((image, index) => (
                <Box
                  key={image.id}
                  sx={{
                    flex: "0 0 auto",
                    width: {
                      xs: "calc(100% - 16px)",
                      sm: "calc(50% - 16px)",
                      md: "calc(33.33% - 16px)",
                      lg: "calc(25% - 16px)",
                    },
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
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
                      <CardHeader
                        title={image.name}
                        titleTypographyProps={{
                          variant: "subtitle2",
                          noWrap: true,
                          title: image.name,
                        }}
                        sx={{
                          p: 1.5,
                          pb: 0.5,
                          "& .MuiCardHeader-content": { overflow: "hidden" },
                        }}
                      />
                      <Box
                        sx={{
                          position: "relative",
                          flexGrow: 1,
                          cursor: "pointer",
                          overflow: "hidden",
                        }}
                        onClick={() => handlePreviewImage(image)}
                      >
                        <CardMedia
                          component="img"
                          height="160"
                          image={image.s3URL}
                          alt={image.name}
                          sx={{
                            objectFit: "cover",
                            transition: "transform 0.3s ease",
                            "&:hover": {
                              transform: "scale(1.05)",
                            },
                          }}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "rgba(0,0,0,0.3)",
                            opacity: 0,
                            transition: "opacity 0.3s",
                            "&:hover": {
                              opacity: 1,
                            },
                          }}
                        >
                          <Maximize2 color="white" size={24} />
                        </Box>
                      </Box>
                      <Divider />
                      <CardActions sx={{ p: 1, justifyContent: "space-between" }}>
                        <Box>
                          <Tooltip title="ערוך">
                            <IconButton size="small" color="primary" onClick={() => handleOpenModal(image.id)}>
                              <Edit size={18} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="מחק">
                            <IconButton size="small" color="error" onClick={() => handleDelete(image.id)}>
                              <Trash2 size={18} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </CardActions>
                    </Card>
                  </motion.div>
                </Box>
              ))}
            </AnimatePresence>
          </Box>
        )}

        {/* Update Image Modal */}
        <Modal open={openModal} onClose={handleCloseModal} aria-labelledby="update-image-modal">
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "90%", sm: 400 },
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" component="h2" gutterBottom>
              עדכון תמונה
            </Typography>
            <Box sx={{ mt: 2, mb: 3 }}>
              <TextField
                type="file"
                fullWidth
                onChange={handleFileChange}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                sx={{
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
                inputProps={{ accept: "image/*" }}
              />
              {selectedFile && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  נבחר: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </Typography>
              )}
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
              <Button variant="outlined" onClick={handleCloseModal} sx={{ color: "#f49b85", borderColor: "#f49b85" }}>
                ביטול
              </Button>
              <Button
                variant="contained"
                onClick={handleUpdate}
                disabled={!selectedFile}
                sx={{ backgroundColor: "#f49b85" }}
              >
                עדכן
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* Image Preview Modal */}
        <Modal open={previewOpen} onClose={() => setPreviewOpen(false)} aria-labelledby="image-preview-modal">
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              maxWidth: "90%",
              maxHeight: "90%",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 2,
              borderRadius: 2,
              outline: "none",
            }}
          >
            <Box sx={{ position: "relative" }}>
              <IconButton
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  bgcolor: "rgba(0,0,0,0.4)",
                  color: "white",
                  "&:hover": { bgcolor: "rgba(0,0,0,0.6)" },
                }}
                onClick={() => setPreviewOpen(false)}
              >
                <ArrowLeft size={20} />
              </IconButton>

              {previewImage && (
                <>
                  <img
                    src={previewImage.s3URL || "/placeholder.svg"}
                    alt={previewImage.name}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "calc(90vh - 100px)",
                      display: "block",
                      margin: "0 auto",
                    }}
                  />
                  <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="subtitle1" fontWeight="medium">
                      {previewImage.name}
                    </Typography>
                    <Box>
                      <Tooltip title="ערוך">
                        <IconButton
                          color="primary"
                          onClick={() => {
                            setPreviewOpen(false)
                            handleOpenModal(previewImage.id)
                          }}
                        >
                          <Edit size={20} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="מחק">
                        <IconButton
                          color="error"
                          onClick={() => {
                            setPreviewOpen(false)
                            handleDelete(previewImage.id)
                          }}
                        >
                          <Trash2 size={20} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    אלבום: {albumName}
                  </Typography>
                </>
              )}
            </Box>
          </Box>
        </Modal>
      </Box>
    </motion.div>
  )
}

export default AlbumPage
