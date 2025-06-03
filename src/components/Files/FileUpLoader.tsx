import React, { useState } from "react"
import axios from "axios"
import { useParams, useNavigate } from "react-router-dom"
import { Box, Button, Typography, LinearProgress, Card, CardContent, IconButton, Tooltip } from "@mui/material"
import { Upload, ArrowLeft, ImageIcon } from "lucide-react"
import { motion } from "framer-motion"

const FileUploader = () => {
  const { id } = useParams<{ id: string }>()
  const albumId = Number.parseInt(id || "0")
  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)
  const [albumName, setAlbumName] = useState<string>("")
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const navigate = useNavigate()

  React.useEffect(() => {
    // Fetch album name
    const fetchAlbumName = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await axios.get(`https://localhost:7251/api/album/${albumId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setAlbumName(response.data.name)
      } catch (error) {
        console.error("Error fetching album name:", error)
      }
    }

    if (albumId > 0) {
      fetchAlbumName()
    }
  }, [albumId])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)

    try {
      // Step 1: Get Presigned URL from server
      const response = await axios.get("https://localhost:7251/api/upload/presigned-url", {
        params: {
          imageName: file.name,
          albumId: albumId,
        },
      })
      const presignedUrl = response.data.url

      // Step 2: Upload file directly to S3
      await axios.put(presignedUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1))
          setProgress(percent)
        },
      })

      // Step 3: Update image info on server
      await axios.post("https://localhost:7251/api/Image", {
        name: file.name,
        s3URL: `https://memoria-bucket-testpnoren.s3.us-east-1.amazonaws.com/${file.name}`,
        albumId: albumId,
        ownerId: Number(localStorage.getItem("userId")) ?? undefined,
      })

      // Success notification
      setTimeout(() => {
        setProgress(0)
        setFile(null)
        setIsUploading(false)
        navigate(`/albums/${albumId}`)
      }, 1000)
    } catch (error) {
      console.error("Error uploading:", error)
      setIsUploading(false)
    }
  }

  const goBack = () => {
    navigate(`/albums/${albumId}`)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Box sx={{ maxWidth: 600, mx: "auto", p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <Tooltip title="חזור לאלבום">
            <IconButton onClick={goBack} color="primary" sx={{ mr: 2 ,color:"#f49b85"}}>
              <ArrowLeft />
            </IconButton>
          </Tooltip>
          <Typography variant="h4" component="h1" fontWeight="bold">
            העלאת תמונה
          </Typography>
        </Box>

        {albumName && (
          <Typography variant="subtitle1" sx={{ mb: 3, color: "text.secondary" }}>
            אלבום: {albumName}
          </Typography>
        )}

        <Card
          elevation={3}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            mb: 4,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box
              sx={{
                border: "2px dashed",
                borderColor: isDragging ? "primary.main" : "divider",
                borderRadius: 2,
                p: 4,
                textAlign: "center",
                backgroundColor: isDragging ? "primary.light" : "background.default",
                transition: "all 0.3s ease",
                cursor: "pointer",
                mb: 3,
              }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <input
                id="file-input"
                type="file"
                onChange={handleFileChange}
                style={{ display: "none" }}
                accept="image/*"
              />
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                {file ? (
                  <>
                    <ImageIcon size={48} color="#f49b85" />
                    <Typography variant="h6">{file.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </Typography>
                  </>
                ) : (
                  <>
                    <Upload size={48} color="#f49b85" />
                    <Typography variant="h6">גרור ושחרר תמונה כאן</Typography>
                    <Typography variant="body2" color="text.secondary">
                      או לחץ לבחירת קובץ
                    </Typography>
                  </>
                )}
              </Box>
            </Box>

            {progress > 0 && (
              <Box sx={{ width: "100%", mt: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: "rgba(251, 193, 173, 0.2)",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: "#f49b85",
                    },
                  }}
                />
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                  {progress}%
                </Typography>
              </Box>
            )}

            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
              <Button variant="outlined" onClick={goBack} disabled={isUploading} sx={{color:"#f49b85",borderColor: "#f49b85",}}>
                ביטול
              </Button>
              <Button
                variant="contained"
                onClick={handleUpload}
                disabled={!file || isUploading}
                sx={{backgroundColor:"#f49b85"}}
                startIcon={<Upload size={18} />}
              >
                {isUploading ? "מעלה..." : "העלה תמונה"}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </motion.div>
  )
}

export default FileUploader
