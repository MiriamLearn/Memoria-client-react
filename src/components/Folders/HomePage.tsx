import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
    Box,
    Container,
    Typography,
    Button,
    Card,
    CardContent,
    Avatar,
    Paper,
    Stack,
} from "@mui/material"

import { FolderPlus, ImageIcon, Palette, Upload, Heart, ArrowLeft, Camera, Sparkles, Users } from "lucide-react"
import { motion } from "framer-motion"
import axios from "axios"
import type { Album } from "../../reducer/AlbumReducer"
import type { Image } from "../../reducer/ImageReducer"

interface UserStats {
    totalAlbums: number
    totalImages: number
    recentActivity: string
}

const HomePage = () => {
    const navigate = useNavigate()
    const [userStats, setUserStats] = useState<UserStats>({
        totalAlbums: 0,
        totalImages: 0,
        recentActivity: "היום",
    })
    const [userName, setUserName] = useState("משתמש יקר")

    useEffect(() => {
        fetchUserStats()
    }, [])

    const fetchUserStats = async () => {
        try {
            const token = localStorage.getItem("token")
            const response = await axios.get<Album[]>("https://memoria-api-pukg.onrender.com/api/album", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            const albums = response.data || []
            let totalImages = 0

            // חישוב סך התמונות
            for (const album of albums) {
                try {
                    const detailResponse = await axios.get<Album>(`https://memoria-api-pukg.onrender.com/api/album/${album.id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })
                    const activeImages = detailResponse.data.imageList?.filter((image: Image) => !image.isDeleted) || []
                    totalImages += activeImages.length
                } catch (error) {
                    console.error("Error fetching album details:", error)
                }
            }

            setUserStats({
                totalAlbums: albums.length,
                totalImages,
                recentActivity: albums.length > 0 ? "היום" : "עדיין לא התחלת",
            })

            // ניסיון לקבל שם משתמש מה-localStorage או מהשרת
            const savedEmail = JSON.parse(localStorage.getItem("formData") || "{}")?.email
            if (savedEmail) {
                setUserName(savedEmail.split("@")[0])
            }
        } catch (error) {
            console.error("Error fetching user stats:", error)
        }
    }

    const features = [
        {
            icon: <FolderPlus size={32} />,
            title: "ניהול אלבומים",
            description: "צור וארגן אלבומים לכל אירוע ורגע מיוחד",
            color: "#f49b85",
        },
        {
            icon: <Upload size={32} />,
            title: "העלאת תמונות",
            description: "העלה תמונות בקלות ושמור אותן בענן",
            color: "#ec4899",
        },
        {
            icon: <Palette size={32} />,
            title: "יצירת קולאז'ים",
            description: "או באופן ידני AI צור קולאז'ים מרהיבים עם ",
            color: "#6366f1",
        },
        {
            icon: <Sparkles size={32} />,
            title: "עיצוב חכם",
            description: "ליצירת עיצובים מותאמים אישית AI -השתמש ב",
            color: "#10b981",
        },
    ]

    const quickActions = [
        {
            title: "צור אלבום חדש",
            description: "התחל לשמור זכרונות חדשים",
            icon: <FolderPlus size={20} />,
            action: () => navigate("/albums"),
            color: "#f49b85",
        },
        {
            title: "צפה באלבומים",
            description: "עיין בכל התמונות שלך",
            icon: <ImageIcon size={20} />,
            action: () => navigate("/albums"),
            color: "#ec4899",
        },
        {
            title: "'צור קולאז",
            description: "יצירה אמנותית מהתמונות שלך",
            icon: <Palette size={20} />,
            action: () => navigate("/albums"),
            color: "#6366f1",
        },
    ]

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            background: "linear-gradient(135deg, #f49b85 0%, #ec4899 100%)",
                            color: "white",
                            p: 4,
                            borderRadius: 4,
                            mb: 4,
                            position: "relative",
                            overflow: "hidden",
                        }}
                    >
                        {/* Background Pattern */}
                        <Box
                            sx={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                width: "100%",
                                height: "100%",
                                opacity: 0.1,
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.4'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                            }}
                        />

                        <Box sx={{ position: "relative", zIndex: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                                <Avatar
                                    sx={{
                                        width: 64,
                                        height: 64,
                                        backgroundColor: "rgba(255,255,255,0.2)",
                                        color: "white",
                                        mr: 3,
                                        fontSize: "1.5rem",
                                    }}
                                >
                                    <Users size={32} />
                                </Avatar>
                                <Box>
                                    <Typography variant="h4" fontWeight="bold" gutterBottom>                            
                                     !{userName} שלום 👋
                                    </Typography>
                                    <Typography variant="h6" sx={{ opacity: 0.9 }}>
                                      Memoria -ברוך הבא חזרה ל
                                    </Typography>
                                </Box>
                            </Box>

                            <Typography variant="body1" sx={{ mb: 3, opacity: 0.95, fontSize: "1.1rem" }}>
                                המקום שלך לשמור, לארגן וליצור מהזכרונות הכי יקרים שלך
                            </Typography>

                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => navigate("/albums")}
                                sx={{
                                    backgroundColor: "rgba(255,255,255,0.2)",
                                    color: "white",
                                    px: 4,
                                    py: 1.5,
                                    fontSize: "1.1rem",
                                    "&:hover": {
                                        backgroundColor: "rgba(255,255,255,0.3)",
                                    },
                                }}
                                endIcon={<ArrowLeft size={20} />}
                            >
                                צפה באלבומים שלי
                            </Button>
                        </Box>
                    </Paper>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
                            gap: 3,
                            mb: 4,
                        }}
                    >
                        <Card sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
                                <Avatar sx={{ backgroundColor: "#f49b85", width: 56, height: 56 }}>
                                    <FolderPlus size={28} />
                                </Avatar>
                            </Box>
                            <Typography variant="h4" fontWeight="bold" color="#f49b85">
                                {userStats.totalAlbums}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                אלבומים
                            </Typography>
                        </Card>

                        <Card sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
                                <Avatar sx={{ backgroundColor: "#ec4899", width: 56, height: 56 }}>
                                    <Camera size={28} />
                                </Avatar>
                            </Box>
                            <Typography variant="h4" fontWeight="bold" color="#ec4899">
                                {userStats.totalImages}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                תמונות
                            </Typography>
                        </Card>
                       
                        <Card sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
                                <Avatar sx={{ backgroundColor: "#6366f1", width: 56, height: 56 }}>
                                    <Heart size={28} />
                                </Avatar>
                            </Box>
                            <Typography variant="h4" fontWeight="bold" color="#6366f1">
                                {userStats.recentActivity}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                פעילות אחרונה
                            </Typography>
                        </Card>
                    </Box>
                </motion.div>

                {/* Features Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                        ?Memoria -מה אפשר לעשות ב
                    </Typography>

                    {/* <Grid container spacing={3} sx={{ mb: 4 }}> */}
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
                            gap: 3,
                            mb: 4,
                        }}
                    >
                        {features.map((feature, index) => (
                            // <Grid xs={12} sm={6} md={3} key={index}>
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                            >
                                <Card
                                    sx={{
                                        p: 3,
                                        height: "100%",
                                        borderRadius: 3,
                                        transition: "all 0.3s ease",
                                        "&:hover": {
                                            transform: "translateY(-5px)",
                                            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                                        },
                                    }}
                                >
                                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                        <Avatar sx={{ backgroundColor: `${feature.color}20`, color: feature.color, mr: 2 }}>
                                            {feature.icon}
                                        </Avatar>
                                    </Box>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                                        {feature.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {feature.description}
                                    </Typography>
                                </Card>
                            </motion.div>
                            // </Grid>
                        ))}
                    </Box>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.0 }}
                >
                    <Typography variant="h5" fontWeight="bold" gutterBottom sx={{  mt: 8,mb: 3 }}>
                        פעולות מהירות
                    </Typography>



                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 2,
                        }}
                    >
                        {/* <Grid container spacing={2}> */}
                        {quickActions.map((action, index) => (
                            <Box
                                key={index}
                                sx={{
                                    flex: {
                                        xs: "100%",
                                        sm: "calc(33.333% - 16px)", // שווה ערך ל-sm={4}
                                    },
                                }}>
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                                >
                                    <Card
                                        sx={{
                                            p: 2,
                                            cursor: "pointer",
                                            borderRadius: 3,
                                            transition: "all 0.3s ease",
                                            "&:hover": {
                                                transform: "scale(1.02)",
                                                boxShadow: `0 8px 25px ${action.color}30`,
                                            },
                                        }}
                                        onClick={action.action}
                                    >
                                        <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                                            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                                <Avatar
                                                    sx={{
                                                        backgroundColor: `${action.color}20`,
                                                        color: action.color,
                                                        mr: 2,
                                                        width: 40,
                                                        height: 40,
                                                    }}
                                                >
                                                    {action.icon}
                                                </Avatar>
                                                <Typography variant="h6" fontWeight="bold">
                                                    {action.title}
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" color="text.secondary">
                                                {action.description}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Box>
                        ))}
                    </Box>
                    {/* </Grid> */}
                </motion.div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.4 }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            mt: 6,
                            p: 4,
                            textAlign: "center",
                            borderRadius: 4,
                            background: "linear-gradient(135deg, #fdf5f0 0%, #f8f0eb 100%)",
                            border: "1px solid #f49b8520",
                        }}
                    >
                        <Typography variant="h5" fontWeight="bold" gutterBottom color="#f49b85">
                            ?מוכן להתחיל 
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                            צור את האלבום הראשון שלך והתחל לשמור את הזכרונות הכי יקרים
                        </Typography>
                        <Stack direction="row" spacing={2} justifyContent="center">
                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => navigate("/albums")}
                                sx={{
                                    backgroundColor: "#f49b85",
                                    px: 4,
                                    py: 1.5,
                                    "&:hover": { backgroundColor: "#e98971" },
                                }}
                                startIcon={<FolderPlus size={20} />}
                            >
                                צור אלבום חדש
                            </Button>
                            <Button
                                variant="outlined"
                                size="large"
                                onClick={() => navigate("/albums")}
                                sx={{
                                    color: "#f49b85",
                                    borderColor: "#f49b85",
                                    px: 4,
                                    py: 1.5,
                                    "&:hover": {
                                        borderColor: "#e98971",
                                        backgroundColor: "#f49b8510",
                                    },
                                }}
                                startIcon={<ImageIcon size={20} />}
                            >
                                צפה באלבומים
                            </Button>
                        </Stack>
                    </Paper>
                </motion.div>
            </Container>
        </motion.div>
    )
}

export default HomePage
