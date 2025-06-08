// import { useState, useEffect, useReducer } from "react"
// import axios from "axios"
// import { useParams, useNavigate } from "react-router-dom"
// import {
//   Box,
//   Button,
//   Typography,
//   Card,
//   Grid,
//   Skeleton,
//   Breadcrumbs,
//   Chip,
//   Paper,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Slider,
//   Switch,
//   FormControlLabel,
//   CircularProgress,
//   CardMedia,
//   Tooltip,
//   Divider,
//   Stack,
// } from "@mui/material"
// import { Home, Wand2, Download, Palette, RefreshCw, Heart, Star, Circle, ContrastIcon as Gradient } from "lucide-react"
// import { motion } from "framer-motion"
// import { TextField, Alert, Collapse } from "@mui/material"
// import { Sparkles, Send } from "lucide-react"

// // שימוש ב-reducers הקיימים שלך
// import { type Image, imageReducer, initialImageState } from "../../reducer/ImageReducer"
// import { collageReducer, initialCollageState ,AIDesignResponse} from "../../reducer/CollageReducer"

// const CollageCreator = () => {
//   const { id } = useParams<{ id: string }>()
//   const albumId = Number.parseInt(id || "0")
//   const navigate = useNavigate()

//   // שימוש ב-reducers
//   const [images, dispatchImages] = useReducer(imageReducer, initialImageState)
//   const [settings, dispatchSettings] = useReducer(collageReducer, initialCollageState)

//   const [albumName, setAlbumName] = useState("")
//   const [loading, setLoading] = useState(true)
//   const [generating, setGenerating] = useState(false)
//   const [generatedCollage, setGeneratedCollage] = useState<string | null>(null)
//   const [aiPrompt, setAiPrompt] = useState("")
//   const [aiLoading, setAiLoading] = useState(false)
//   const [aiExplanation, setAiExplanation] = useState("")
//   const [showAiExplanation, setShowAiExplanation] = useState(false)
//   const [backgroundType, setBackgroundType] = useState<"solid" | "hearts" | "stars" | "dots" | "gradient">("solid")

//   useEffect(() => {
//     fetchAlbumData()
//   }, [albumId])

//   const fetchAlbumData = async () => {
//     try {
//       const token = localStorage.getItem("token")
//       const response = await axios.get(`https://localhost:7251/api/album/${albumId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       })

//       setAlbumName(response.data.name)
//       const activeImages = response.data.imageList?.filter((image: any) => !image.isDeleted) || []
//       dispatchImages({ type: "SET_IMAGES", payload: activeImages })
//     } catch (error) {
//       console.error("שגיאה בטעינת נתוני האלבום:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const generateWithAI = async () => {
//     if (!aiPrompt.trim()) {
//       alert("אנא כתוב בקשה לעיצוב הקולאז'")
//       return
//     }

//     console.log("🚀 Starting AI generation with prompt:", aiPrompt)
//     setAiLoading(true)
//     setShowAiExplanation(false)

//     try {
//       const token = localStorage.getItem("token")

//       console.log("📡 Sending request to AI service...")
//       const response = await axios.post(
//         "https://localhost:7251/api/AICollage/design",
//         { prompt: aiPrompt },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         },
//       )

//       console.log("✅ AI Response received:", response)
//       console.log("📦 AI Response data:", response.data)

//       const aiDesign = response.data

//       // הוסף לוגים מפורטים
//       console.log("🤖 AI Design Object:", aiDesign)
//       console.log("📊 ImageCount from AI:", aiDesign.imageCount)
//       console.log("🎨 BackgroundType from AI:", aiDesign.backgroundType)

//       // בדיקה אם התשובה תקינה
//       if (!aiDesign || typeof aiDesign !== "object") {
//         console.error("❌ Invalid AI response - not an object")
//         alert("התקבלה תשובה לא תקינה מה-AI")
//         return
//       }

//       // עדכון ההגדרות בהתאם לתשובת ה-AI
//       console.log("🔄 Updating settings...")

//       if (aiDesign.layout) {
//         console.log("📐 Setting layout to:", aiDesign.layout)
//         dispatchSettings({ type: "SET_LAYOUT", payload: aiDesign.layout })
//       }

//       if (aiDesign.style) {
//         console.log("🎭 Setting style to:", aiDesign.style)
//         dispatchSettings({ type: "SET_STYLE", payload: aiDesign.style })
//       }

//       if (aiDesign.imageCount) {
//         const finalImageCount = Math.min(aiDesign.imageCount, images.length)
//         console.log(
//           "📊 Setting imageCount to:",
//           finalImageCount,
//           "(requested:",
//           aiDesign.imageCount,
//           ", available:",
//           images.length,
//           ")",
//         )
//         dispatchSettings({ type: "SET_IMAGE_COUNT", payload: finalImageCount })
//       }

//       if (aiDesign.spacing !== undefined) {
//         console.log("📏 Setting spacing to:", aiDesign.spacing)
//         dispatchSettings({ type: "SET_SPACING", payload: aiDesign.spacing })
//       }

//       if (aiDesign.borderRadius !== undefined) {
//         console.log("🔄 Setting borderRadius to:", aiDesign.borderRadius)
//         dispatchSettings({ type: "SET_BORDER_RADIUS", payload: aiDesign.borderRadius })
//       }

//       if (aiDesign.addText !== undefined) {
//         console.log("📝 Setting addText to:", aiDesign.addText)
//         dispatchSettings({ type: "SET_ADD_TEXT", payload: aiDesign.addText })
//       }

//       // עדכון סוג הרקע מה-AI
//       if (aiDesign.backgroundType) {
//         console.log("🎨 Setting background type to:", aiDesign.backgroundType)
//         setBackgroundType(aiDesign.backgroundType)
//       }

//       // הצגת ההסבר
//       if (aiDesign.explanation) {
//         setAiExplanation(aiDesign.explanation)
//         setShowAiExplanation(true)
//       }

//       console.log("✅ All settings updated successfully")

//       // יצירת הקולאז' עם הערכים החדשים ישירות מה-AI
//       console.log("🎨 Starting collage generation with AI values...")

//       // יצירת אובייקט הגדרות חדש עם הערכים מה-AI
//       const aiSettings = {
//         layout: aiDesign.layout || settings.layout,
//         style: aiDesign.style || settings.style,
//         imageCount: Math.min(aiDesign.imageCount || settings.imageCount, images.length),
//         spacing: aiDesign.spacing !== undefined ? aiDesign.spacing : settings.spacing,
//         borderRadius: aiDesign.borderRadius !== undefined ? aiDesign.borderRadius : settings.borderRadius,
//         addText: aiDesign.addText !== undefined ? aiDesign.addText : settings.addText,
//       }

//       const aiBgType = aiDesign.backgroundType || backgroundType

//       console.log("🎨 Using AI settings:", aiSettings)
//       console.log("🎨 Using AI background type:", aiBgType)

//       setTimeout(() => {
//         generateCollageWithSettings(aiSettings, aiBgType)
//       }, 500)
//     } catch (error) {
//       console.error("❌ Error with AI:", error)
//       // console.error("❌ Error details:", error.response?.data)
//       alert("אירעה שגיאה בקבלת עיצוב מה-AI. נסה שוב.")
//     } finally {
//       setAiLoading(false)
//     }
//   }

//   // פונקציה חדשה שמקבלת הגדרות ספציפיות
//   const generateCollageWithSettings = async (customSettings?: any, customBgType?: string) => {
//     if (images.length < 2) {
//       alert("נדרשות לפחות 2 תמונות ליצירת קולאז'")
//       return
//     }

//     const finalSettings = customSettings || settings
//     const finalBgType = customBgType || backgroundType

//     console.log("🎨 Starting collage generation...")
//     console.log("📊 Using settings:", finalSettings)
//     console.log("🎨 Using backgroundType:", finalBgType)

//     setGenerating(true)

//     try {
//       // בחירת תמונות אקראיות לפי הגדרות המשתמש
//       const selectedImages = images
//         .sort(() => Math.random() - 0.5)
//         .slice(0, Math.min(finalSettings.imageCount, images.length))

//       console.log("🖼️ Selected", selectedImages.length, "images for collage")

//       // יצירת הקולאז' בפועל
//       await createCollage(selectedImages, finalSettings, finalBgType)
//     } catch (error) {
//       console.error("שגיאה ביצירת הקולאז':", error)
//       alert("אירעה שגיאה ביצירת הקולאז'. נסה שוב.")
//     } finally {
//       setGenerating(false)
//     }
//   }

//   // פונקציה לטעינת תמונה דרך השרת שלך
//   const loadImageViaProxy = async (imageUrl: string): Promise<HTMLImageElement> => {
//     return new Promise(async (resolve, reject) => {
//       try {
//         const token = localStorage.getItem("token")

//         // קבלת התמונה דרך השרת שלך
//         const response = await axios.get(`https://localhost:7251/api/image/proxy`, {
//           params: { url: imageUrl },
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           responseType: "blob",
//         })

//         // יצירת URL זמני מה-blob
//         const blob = response.data
//         const blobUrl = URL.createObjectURL(blob)

//         const image = new Image()
//         image.onload = () => {
//           URL.revokeObjectURL(blobUrl) // ניקוי הזיכרון
//           resolve(image)
//         }
//         image.onerror = () => {
//           URL.revokeObjectURL(blobUrl)
//           reject(new Error(`Failed to load image: ${imageUrl}`))
//         }
//         image.src = blobUrl
//       } catch (error) {
//         console.error("שגיאה בטעינת תמונה דרך proxy:", error)
//         reject(error)
//       }
//     })
//   }

//   const generateCollage = async () => {
//     await generateCollageWithSettings()
//   }

//   // פונקציה נפרדת לערבוב תמונות (ללא שינוי הגדרות)
//   const shuffleAndGenerate = async () => {
//     await generateCollageWithSettings()
//   }

//   const createCollage = async (selectedImages: Image[], customSettings?: any, customBgType?: string) => {
//     const finalSettings = customSettings || settings
//     const finalBgType = customBgType || backgroundType

//     console.log("🎨 Creating collage with", selectedImages.length, "images")
//     console.log("🎨 Background type:", finalBgType)
//     console.log("📊 Settings:", finalSettings)

//     // יצירת canvas לקולאז'
//     const canvas = document.createElement("canvas")
//     const ctx = canvas.getContext("2d")

//     if (!ctx) return

//     // הגדרת גודל הקנבס
//     canvas.width = 800
//     canvas.height = 600

//     // רקע
//     console.log("🎨 Drawing background with type:", finalBgType, "and style:", finalSettings.style)
//     drawBackground(ctx, canvas.width, canvas.height, finalSettings.style, finalBgType)

//     try {
//       // טעינת התמונות דרך השרת
//       const loadedImages: HTMLImageElement[] = []

//       for (const img of selectedImages) {
//         try {
//           console.log(`טוען תמונה: ${img.s3URL}`)
//           const image = await loadImageViaProxy(img.s3URL)
//           loadedImages.push(image)
//           console.log(`תמונה נטענה בהצלחה: ${img.name}`)
//         } catch (error) {
//           console.warn(`נכשל בטעינת תמונה: ${img.name}`, error)
//           // ממשיך לתמונה הבאה
//         }
//       }

//       if (loadedImages.length === 0) {
//         throw new Error("לא ניתן לטעון אף תמונה")
//       }

//       console.log(`נטענו ${loadedImages.length} תמונות מתוך ${selectedImages.length}`)

//       // יצירת הפריסה לפי הסגנון שנבחר
//       switch (finalSettings.layout) {
//         case "grid":
//           drawGridLayout(ctx, loadedImages, canvas.width, canvas.height, finalSettings)
//           break
//         case "mosaic":
//           drawMosaicLayout(ctx, loadedImages, canvas.width, canvas.height, finalSettings)
//           break
//         case "artistic":
//           drawArtisticLayout(ctx, loadedImages, canvas.width, canvas.height, finalSettings)
//           break
//         case "magazine":
//           drawMagazineLayout(ctx, loadedImages, canvas.width, canvas.height, finalSettings)
//           break
//       }

//       // הוספת טקסט אם נדרש
//       if (finalSettings.addText) {
//         addTextToCollage(ctx, albumName, canvas.width, canvas.height, finalSettings)
//       }

//       // המרה ל-base64
//       const collageDataUrl = canvas.toDataURL("image/png")
//       setGeneratedCollage(collageDataUrl)
//       console.log("✅ קולאז' נוצר בהצלחה!")
//     } catch (error) {
//       console.error("שגיאה ביצירת הקולאז':", error)
//       throw error
//     }
//   }

//   const getBackgroundColor = (style: string): string => {
//     switch (style) {
//       case "vintage":
//         return "#f4f1e8"
//       case "minimalist":
//         return "#ffffff"
//       case "vibrant":
//         return "#f0f8ff"
//       default:
//         return "#fafafa"
//     }
//   }

//   const drawGridLayout = (
//     ctx: CanvasRenderingContext2D,
//     images: HTMLImageElement[],
//     width: number,
//     height: number,
//     customSettings?: any,
//   ) => {
//     const finalSettings = customSettings || settings
//     const cols = Math.ceil(Math.sqrt(images.length))
//     const rows = Math.ceil(images.length / cols)
//     const cellWidth = (width - finalSettings.spacing * (cols + 1)) / cols
//     const cellHeight = (height - finalSettings.spacing * (rows + 1)) / rows

//     images.forEach((img, index) => {
//       const col = index % cols
//       const row = Math.floor(index / cols)
//       const x = finalSettings.spacing + col * (cellWidth + finalSettings.spacing)
//       const y = finalSettings.spacing + row * (cellHeight + finalSettings.spacing)

//       // עיגול פינות
//       if (finalSettings.borderRadius > 0) {
//         ctx.save()
//         roundRect(ctx, x, y, cellWidth, cellHeight, finalSettings.borderRadius)
//         ctx.clip()
//       }

//       ctx.drawImage(img, x, y, cellWidth, cellHeight)

//       if (finalSettings.borderRadius > 0) {
//         ctx.restore()
//       }
//     })
//   }

//   const drawMosaicLayout = (
//     ctx: CanvasRenderingContext2D,
//     images: HTMLImageElement[],
//     width: number,
//     height: number,
//     customSettings?: any,
//   ) => {
//     const finalSettings = customSettings || settings
//     // פריסת פסיפס אקראית
//     const positions = generateMosaicPositions(images.length, width, height)

//     images.forEach((img, index) => {
//       const pos = positions[index]
//       if (pos) {
//         ctx.save()
//         if (finalSettings.borderRadius > 0) {
//           roundRect(ctx, pos.x, pos.y, pos.width, pos.height, finalSettings.borderRadius)
//           ctx.clip()
//         }
//         ctx.drawImage(img, pos.x, pos.y, pos.width, pos.height)
//         ctx.restore()
//       }
//     })
//   }

//   const drawArtisticLayout = (
//     ctx: CanvasRenderingContext2D,
//     images: HTMLImageElement[],
//     width: number,
//     height: number,
//     customSettings?: any,
//   ) => {
//     const finalSettings = customSettings || settings
//     // פריסה אמנותית עם זוויות וחפיפות
//     images.forEach((img, index) => {
//       const angle = (Math.random() - 0.5) * 0.3 // זווית קלה
//       const scale = 0.7 + Math.random() * 0.3
//       const x = Math.random() * (width * 0.6) + width * 0.2
//       const y = Math.random() * (height * 0.6) + height * 0.2
//       const imgWidth = (width / 3) * scale
//       const imgHeight = (height / 3) * scale

//       ctx.save()
//       ctx.translate(x + imgWidth / 2, y + imgHeight / 2)
//       ctx.rotate(angle)

//       if (finalSettings.borderRadius > 0) {
//         roundRect(ctx, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight, finalSettings.borderRadius)
//         ctx.clip()
//       }

//       ctx.drawImage(img, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight)
//       ctx.restore()
//     })
//   }

//   const drawMagazineLayout = (
//     ctx: CanvasRenderingContext2D,
//     images: HTMLImageElement[],
//     width: number,
//     height: number,
//     customSettings?: any,
//   ) => {
//     const finalSettings = customSettings || settings
//     // פריסת מגזין עם תמונה מרכזית גדולה
//     if (images.length === 0) return

//     // תמונה מרכזית
//     const mainImg = images[0]
//     const mainWidth = width * 0.6
//     const mainHeight = height * 0.7
//     const mainX = (width - mainWidth) / 2
//     const mainY = (height - mainHeight) / 2

//     ctx.save()
//     if (finalSettings.borderRadius > 0) {
//       roundRect(ctx, mainX, mainY, mainWidth, mainHeight, finalSettings.borderRadius)
//       ctx.clip()
//     }
//     ctx.drawImage(mainImg, mainX, mainY, mainWidth, mainHeight)
//     ctx.restore()

//     // תמונות קטנות בצדדים
//     const sideImages = images.slice(1)
//     const sideWidth = width * 0.15
//     const sideHeight = height * 0.2

//     sideImages.forEach((img, index) => {
//       const isLeft = index % 2 === 0
//       const x = isLeft ? finalSettings.spacing : width - sideWidth - finalSettings.spacing
//       const y = finalSettings.spacing + index * (sideHeight + finalSettings.spacing)

//       if (y + sideHeight <= height - finalSettings.spacing) {
//         ctx.save()
//         if (finalSettings.borderRadius > 0) {
//           roundRect(ctx, x, y, sideWidth, sideHeight, finalSettings.borderRadius)
//           ctx.clip()
//         }
//         ctx.drawImage(img, x, y, sideWidth, sideHeight)
//         ctx.restore()
//       }
//     })
//   }

//   const generateMosaicPositions = (count: number, width: number, height: number) => {
//     const positions = []
//     const minSize = Math.min(width, height) * 0.15
//     const maxSize = Math.min(width, height) * 0.4

//     for (let i = 0; i < count; i++) {
//       const size = minSize + Math.random() * (maxSize - minSize)
//       const x = Math.random() * (width - size)
//       const y = Math.random() * (height - size)

//       positions.push({
//         x,
//         y,
//         width: size,
//         height: size,
//       })
//     }

//     return positions
//   }

//   const roundRect = (
//     ctx: CanvasRenderingContext2D,
//     x: number,
//     y: number,
//     width: number,
//     height: number,
//     radius: number,
//   ) => {
//     ctx.beginPath()
//     ctx.moveTo(x + radius, y)
//     ctx.lineTo(x + width - radius, y)
//     ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
//     ctx.lineTo(x + width, y + height - radius)
//     ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
//     ctx.lineTo(x + radius, y + height)
//     ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
//     ctx.lineTo(x, y + radius)
//     ctx.quadraticCurveTo(x, y, x + radius, y)
//     ctx.closePath()
//   }

//   const addTextToCollage = (
//     ctx: CanvasRenderingContext2D,
//     text: string,
//     width: number,
//     height: number,
//     customSettings?: any,
//   ) => {
//     const finalSettings = customSettings || settings
//     ctx.save()
//     ctx.font = "bold 24px Arial"
//     ctx.fillStyle = finalSettings.style === "minimalist" ? "#333" : "#fff"
//     ctx.strokeStyle = finalSettings.style === "minimalist" ? "#fff" : "#333"
//     ctx.lineWidth = 2
//     ctx.textAlign = "center"

//     const x = width / 2
//     const y = height - 30

//     ctx.strokeText(text, x, y)
//     ctx.fillText(text, x, y)
//     ctx.restore()
//   }

//   const downloadCollage = () => {
//     if (!generatedCollage) return

//     const link = document.createElement("a")
//     link.download = `${albumName}-collage.png`
//     link.href = generatedCollage
//     document.body.appendChild(link)
//     link.click()
//     document.body.removeChild(link)
//   }

//   const drawBackground = (
//     ctx: CanvasRenderingContext2D,
//     width: number,
//     height: number,
//     style: string,
//     bgType: string,
//   ) => {
//     console.log("🎨 Drawing background - style:", style, "bgType:", bgType)

//     // רקע בסיסי
//     ctx.fillStyle = getBackgroundColor(style)
//     ctx.fillRect(0, 0, width, height)

//     // הוספת דקורציות
//     switch (bgType) {
//       case "hearts":
//         console.log("💕 Drawing hearts background")
//         drawHearts(ctx, width, height)
//         break
//       case "stars":
//         console.log("⭐ Drawing stars background")
//         drawStars(ctx, width, height)
//         break
//       case "dots":
//         console.log("🔵 Drawing dots background")
//         drawDots(ctx, width, height)
//         break
//       case "gradient":
//         console.log("🌈 Drawing gradient background")
//         drawGradientBackground(ctx, width, height, style)
//         break
//       default:
//         console.log("⚪ Drawing solid background")
//     }
//   }

//   const drawHearts = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
//     ctx.fillStyle = "rgba(255, 182, 193, 0.4)" // ורוד בהיר שקוף

//     for (let i = 0; i < 25; i++) {
//       const x = Math.random() * width
//       const y = Math.random() * height
//       const size = 8 + Math.random() * 16

//       // ציור לב משופר
//       ctx.save()
//       ctx.translate(x, y)
//       ctx.beginPath()
//       ctx.arc(-size / 4, -size / 4, size / 4, 0, Math.PI * 2)
//       ctx.arc(size / 4, -size / 4, size / 4, 0, Math.PI * 2)
//       ctx.moveTo(-size / 2, 0)
//       ctx.lineTo(0, size / 2)
//       ctx.lineTo(size / 2, 0)
//       ctx.fill()
//       ctx.restore()
//     }
//   }

//   const drawStars = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
//     ctx.fillStyle = "rgba(255, 215, 0, 0.5)" // זהב שקוף

//     for (let i = 0; i < 35; i++) {
//       const x = Math.random() * width
//       const y = Math.random() * height
//       const size = 4 + Math.random() * 12

//       // ציור כוכב משופר
//       ctx.save()
//       ctx.translate(x, y)
//       ctx.beginPath()
//       for (let j = 0; j < 5; j++) {
//         const angle = (j * Math.PI * 2) / 5 - Math.PI / 2
//         const radius = j % 2 === 0 ? size : size / 2
//         const px = Math.cos(angle) * radius
//         const py = Math.sin(angle) * radius
//         if (j === 0) ctx.moveTo(px, py)
//         else ctx.lineTo(px, py)
//       }
//       ctx.closePath()
//       ctx.fill()
//       ctx.restore()
//     }
//   }

//   const drawDots = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
//     ctx.fillStyle = "rgba(100, 149, 237, 0.4)" // כחול שקוף

//     for (let i = 0; i < 60; i++) {
//       const x = Math.random() * width
//       const y = Math.random() * height
//       const radius = 2 + Math.random() * 6

//       ctx.beginPath()
//       ctx.arc(x, y, radius, 0, Math.PI * 2)
//       ctx.fill()
//     }
//   }

//   const drawGradientBackground = (ctx: CanvasRenderingContext2D, width: number, height: number, style: string) => {
//     const gradient = ctx.createLinearGradient(0, 0, width, height)

//     switch (style) {
//       case "vintage":
//         gradient.addColorStop(0, "#f4f1e8")
//         gradient.addColorStop(0.5, "#e8dcc0")
//         gradient.addColorStop(1, "#d4c4a0")
//         break
//       case "vibrant":
//         gradient.addColorStop(0, "#ff9a9e")
//         gradient.addColorStop(0.5, "#fecfef")
//         gradient.addColorStop(1, "#ffecd2")
//         break
//       case "minimalist":
//         gradient.addColorStop(0, "#ffffff")
//         gradient.addColorStop(0.5, "#f8f8f8")
//         gradient.addColorStop(1, "#f0f0f0")
//         break
//       default:
//         gradient.addColorStop(0, "#fafafa")
//         gradient.addColorStop(0.5, "#f0f0f0")
//         gradient.addColorStop(1, "#e0e0e0")
//     }

//     ctx.fillStyle = gradient
//     ctx.fillRect(0, 0, width, height)
//   }

//   const getBackgroundIcon = (type: string) => {
//     switch (type) {
//       case "hearts":
//         return <Heart size={16} />
//       case "stars":
//         return <Star size={16} />
//       case "dots":
//         return <Circle size={16} />
//       case "gradient":
//         return <Gradient size={16} />
//       default:
//         return <Palette size={16} />
//     }
//   }

//   const getBackgroundLabel = (type: string) => {
//     switch (type) {
//       case "hearts":
//         return "לבבות 💕"
//       case "stars":
//         return "כוכבים ⭐"
//       case "dots":
//         return "נקודות 🔵"
//       case "gradient":
//         return "גרדיאנט 🌈"
//       default:
//         return "רקע חלק"
//     }
//   }

//   if (loading) {
//     return (
//       <Box sx={{ p: 3 }}>
//         <Skeleton width={200} height={30} sx={{ mb: 2 }} />
//         <Skeleton width={300} height={20} sx={{ mb: 4 }} />
//         <Grid container spacing={2}>
//           {[1, 2, 3, 4].map((item) => (
//             <Grid item xs={12} md={6} key={item}>
//               <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
//             </Grid>
//           ))}
//         </Grid>
//       </Box>
//     )
//   }

//   if (images.length < 2) {
//     return (
//       <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
//         <Box sx={{ p: 3 }}>
//           <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ mb: 2 }}>
//             <Typography
//               component="button"
//               onClick={() => navigate("/")}
//               sx={{
//                 background: "none",
//                 border: "none",
//                 cursor: "pointer",
//                 display: "flex",
//                 alignItems: "center",
//                 fontSize: "inherit",
//                 fontFamily: "inherit",
//                 "&:hover": { color: "#df8670" },
//               }}
//             >
//               <Home size={16} style={{ marginLeft: 4, color: "#df8670" }} />
//               אלבומים
//             </Typography>
//             <Typography
//               component="button"
//               onClick={() => navigate(`/albums/${albumId}`)}
//               sx={{
//                 background: "none",
//                 border: "none",
//                 cursor: "pointer",
//                 fontSize: "inherit",
//                 fontFamily: "inherit",
//                 "&:hover": { color: "#df8670" },
//               }}
//             >
//               {albumName}
//             </Typography>
//             <Typography color="text.primary" fontWeight="medium">
//               יוצר קולאז׳
//             </Typography>
//           </Breadcrumbs>

//           <Paper
//             elevation={0}
//             sx={{ p: 4, textAlign: "center", borderRadius: 4, border: "1px dashed", borderColor: "divider" }}
//           >
//             <Palette size={64} color="#f49b85" />
//             <Typography variant="h6" sx={{ mt: 2 }}>
//               נדרשות לפחות 2 תמונות ליצירת קולאז'
//             </Typography>
//             <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
//               העלה עוד תמונות לאלבום כדי ליצור קולאז'ים מרהיבים
//             </Typography>
//             <Button
//               variant="contained"
//               sx={{ backgroundColor: "#f49b85" }}
//               onClick={() => navigate(`/albums/${albumId}`)}
//             >
//               חזור לאלבום
//             </Button>
//           </Paper>
//         </Box>
//       </motion.div>
//     )
//   }

//   return (
//     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
//       <Box sx={{ p: 3 }}>
//         <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ mb: 2 }}>
//           <Typography
//             component="button"
//             onClick={() => navigate("/")}
//             sx={{
//               background: "none",
//               border: "none",
//               cursor: "pointer",
//               display: "flex",
//               alignItems: "center",
//               fontSize: "inherit",
//               fontFamily: "inherit",
//               "&:hover": { color: "#df8670" },
//             }}
//           >
//             <Home size={16} style={{ marginLeft: 4, color: "#df8670" }} />
//             אלבומים
//           </Typography>
//           <Typography
//             component="button"
//             onClick={() => navigate(`/albums/${albumId}`)}
//             sx={{
//               background: "none",
//               border: "none",
//               cursor: "pointer",
//               fontSize: "inherit",
//               fontFamily: "inherit",
//               "&:hover": { color: "#df8670" },
//             }}
//           >
//             {albumName}
//           </Typography>
//           <Typography color="text.primary" fontWeight="medium">
//             יוצר קולאז׳
//           </Typography>
//         </Breadcrumbs>

//         <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
//           <Typography variant="h4" fontWeight="bold">
//             יוצר קולאז'ים
//           </Typography>
//           <Stack direction="row" spacing={1}>
//             <Chip
//               label={`${images.length} תמונות זמינות`}
//               size="small"
//               variant="outlined"
//               sx={{ color: "#df8670", borderColor: "#f49b85" }}
//             />
//             <Chip
//               icon={getBackgroundIcon(backgroundType)}
//               label={getBackgroundLabel(backgroundType)}
//               size="small"
//               sx={{ backgroundColor: "#f49b85", color: "white" }}
//             />
//           </Stack>
//         </Box>

//         {/* שורה ראשונה: קולאז' + הגדרות */}
//         <Grid container spacing={3} sx={{ mb: 3 }}>
//           {/* תצוגת הקולאז' */}
//           <Grid item xs={12} md={8}>
//             <Card sx={{ p: 3, minHeight: 400 }}>
//               {generatedCollage ? (
//                 <Box>
//                   <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
//                     <Typography variant="h6">הקולאז' שלך</Typography>
//                     <Button
//                       variant="contained"
//                       onClick={downloadCollage}
//                       sx={{ backgroundColor: "#f49b85", "&:hover": { backgroundColor: "#df8670" } }}
//                       startIcon={<Download size={16} />}
//                     >
//                       הורד
//                     </Button>
//                   </Box>
//                   <Box sx={{ textAlign: "center" }}>
//                     <img
//                       src={generatedCollage || "/placeholder.svg"}
//                       alt="Generated Collage"
//                       style={{
//                         maxWidth: "100%",
//                         maxHeight: "500px",
//                         borderRadius: "12px",
//                         boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
//                         border: "2px solid #f0f0f0",
//                       }}
//                     />
//                   </Box>
//                 </Box>
//               ) : (
//                 <Box
//                   sx={{
//                     display: "flex",
//                     flexDirection: "column",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     minHeight: 300,
//                     color: "text.secondary",
//                     background: "linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%)",
//                     borderRadius: 2,
//                     border: "2px dashed #e0e0e0",
//                   }}
//                 >
//                   <Palette size={64} color="#f49b85" />
//                   <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
//                     בחר הגדרות וצור את הקולאז' הראשון שלך
//                   </Typography>
//                   <Typography variant="body2" sx={{ mt: 1, textAlign: "center", maxWidth: 300 }}>
//                     השתמש ב-AI או בהגדרות הידניות ליצירת קולאז'ים יפים מהתמונות שלך
//                   </Typography>
//                 </Box>
//               )}
//             </Card>
//           </Grid>

//           {/* פאנל הגדרות */}
//           <Grid item xs={12} md={4}>
//             <Card sx={{ p: 3, height: "fit-content" }}>
//               <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                 <Wand2 size={20} color="#f49b85" />
//                  הגדרות קולאז׳
//               </Typography>

//               <Box sx={{ mt: 3 }}>
//                 {/* פריסה וסגנון */}
//                 <Grid container spacing={2} sx={{ mb: 3 }}>
//                   <Grid item xs={6}>
//                     <FormControl fullWidth>
//                       <InputLabel>פריסה</InputLabel>
//                       <Select
//                         value={settings.layout}
//                         label="פריסה"
//                         onChange={(e) => dispatchSettings({ type: "SET_LAYOUT", payload: e.target.value as any })}
//                       >
//                         <MenuItem value="grid">רשת</MenuItem>
//                         <MenuItem value="mosaic">פסיפס</MenuItem>
//                         <MenuItem value="artistic">אמנותי</MenuItem>
//                         <MenuItem value="magazine">מגזין</MenuItem>
//                       </Select>
//                     </FormControl>
//                   </Grid>
//                   <Grid item xs={6}>
//                     <FormControl fullWidth>
//                       <InputLabel>סגנון</InputLabel>
//                       <Select
//                         value={settings.style}
//                         label="סגנון"
//                         onChange={(e) => dispatchSettings({ type: "SET_STYLE", payload: e.target.value as any })}
//                       >
//                         <MenuItem value="modern">מודרני</MenuItem>
//                         <MenuItem value="vintage">וינטג'</MenuItem>
//                         <MenuItem value="minimalist">מינימליסטי</MenuItem>
//                         <MenuItem value="vibrant">צבעוני</MenuItem>
//                       </Select>
//                     </FormControl>
//                   </Grid>
//                 </Grid>

//                 <Divider sx={{ my: 2 }} />

//                 {/* סוג רקע */}
//                 <FormControl fullWidth sx={{ mb: 3 }}>
//                   <InputLabel>סוג רקע</InputLabel>
//                   <Select
//                     value={backgroundType}
//                     label="סוג רקע"
//                     onChange={(e) => setBackgroundType(e.target.value as any)}
//                     renderValue={(value) => (
//                       <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                         {getBackgroundIcon(value)}
//                         {getBackgroundLabel(value)}
//                       </Box>
//                     )}
//                   >
//                     <MenuItem value="solid">
//                       <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                         <Palette size={16} />
//                         רקע חלק
//                       </Box>
//                     </MenuItem>
//                     <MenuItem value="hearts">
//                       <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                         <Heart size={16} />
//                         לבבות 💕
//                       </Box>
//                     </MenuItem>
//                     <MenuItem value="stars">
//                       <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                         <Star size={16} />
//                         כוכבים ⭐
//                       </Box>
//                     </MenuItem>
//                     <MenuItem value="dots">
//                       <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                         <Circle size={16} />
//                         נקודות 🔵
//                       </Box>
//                     </MenuItem>
//                     <MenuItem value="gradient">
//                       <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                         <Gradient size={16} />
//                         גרדיאנט 🌈
//                       </Box>
//                     </MenuItem>
//                   </Select>
//                 </FormControl>

//                 <Divider sx={{ my: 2 }} />

//                 {/* מספר תמונות */}
//                 <Typography gutterBottom>מספר תמונות: {settings.imageCount}</Typography>
//                 <Slider
//                   value={settings.imageCount}
//                   onChange={(_, value) => dispatchSettings({ type: "SET_IMAGE_COUNT", payload: value as number })}
//                   min={2}
//                   max={Math.min(images.length, 12)}
//                   marks
//                   valueLabelDisplay="auto"
//                   sx={{ mb: 3, color: "#f49b85" }}
//                 />

//                 {/* רווחים */}
//                 <Typography gutterBottom>רווחים: {settings.spacing}px</Typography>
//                 <Slider
//                   value={settings.spacing}
//                   onChange={(_, value) => dispatchSettings({ type: "SET_SPACING", payload: value as number })}
//                   min={0}
//                   max={30}
//                   valueLabelDisplay="auto"
//                   sx={{ mb: 3, color: "#f49b85" }}
//                 />

//                 {/* עיגול פינות */}
//                 <Typography gutterBottom>עיגול פינות: {settings.borderRadius}px</Typography>
//                 <Slider
//                   value={settings.borderRadius}
//                   onChange={(_, value) => dispatchSettings({ type: "SET_BORDER_RADIUS", payload: value as number })}
//                   min={0}
//                   max={20}
//                   valueLabelDisplay="auto"
//                   sx={{ mb: 3, color: "#f49b85" }}
//                 />

//                 {/* הוסף כותרת */}
//                 <FormControlLabel
//                   control={
//                     <Switch
//                       checked={settings.addText}
//                       onChange={(e) => dispatchSettings({ type: "SET_ADD_TEXT", payload: e.target.checked })}
//                       sx={{
//                         "& .MuiSwitch-switchBase.Mui-checked": {
//                           color: "#f49b85",
//                         },
//                         "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
//                           backgroundColor: "#f49b85",
//                         },
//                       }}
//                     />
//                   }
//                   label="הוסף כותרת"
//                   sx={{ mb: 3 }}
//                 />

//                 <Divider sx={{ my: 2 }} />

//                 {/* כפתורי פעולה */}
//                 <Box sx={{ display: "flex", gap: 1 }}>
//                   <Button
//                     variant="contained"
//                     fullWidth
//                     onClick={generateCollage}
//                     disabled={generating}
//                     sx={{ backgroundColor: "#f49b85", "&:hover": { backgroundColor: "#df8670" } }}
//                     startIcon={generating ? <CircularProgress size={16} color="inherit" /> : <Wand2 size={16} />}
//                   >
//                     {generating ? "יוצר..." : "צור קולאז"}
//                   </Button>

//                   <Tooltip title="ערבב תמונות וצור קולאז' חדש">
//                     <Button
//                       variant="outlined"
//                       onClick={shuffleAndGenerate}
//                       disabled={generating}
//                       sx={{
//                         color: "#f49b85",
//                         borderColor: "#f49b85",
//                         minWidth: "auto",
//                         px: 2,
//                         "&:hover": { borderColor: "#df8670", backgroundColor: "rgba(244, 155, 133, 0.1)" },
//                       }}
//                     >
//                       <RefreshCw size={16} />
//                     </Button>
//                   </Tooltip>
//                 </Box>
//               </Box>
//             </Card>
//           </Grid>
//         </Grid>

//         {/* שורה שנייה: פיצ'ר AI */}
//         <Grid container spacing={3} sx={{ mb: 3 }}>
//           <Grid item xs={12}>
//             <Card sx={{ p: 3, background: "linear-gradient(135deg, #f49b85 0%, #df8670 100%)", color: "white" }}>
//               <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                 <Sparkles size={20} />
//                  AI עיצוב עם 
//               </Typography>

//               <Grid container spacing={2} alignItems="flex-end">
//                 <Grid item xs={12} md={8}>
//                   <TextField
//                     fullWidth
//                     multiline
//                     rows={3}
//                     placeholder='"לדוגמה: "צור קולאז׳ רומנטי עם 4 תמונות ורקע עם לבבות" או "קולאז׳ משפחתי עם כוכבים '
//                     value={aiPrompt}
//                     onChange={(e) => setAiPrompt(e.target.value)}
//                     sx={{
//                       "& .MuiOutlinedInput-root": {
//                         backgroundColor: "rgba(255,255,255,0.9)",
//                         "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
//                         "&:hover fieldset": { borderColor: "rgba(255,255,255,0.5)" },
//                         "&.Mui-focused fieldset": { borderColor: "white" },
//                       },
//                     }}
//                   />
//                 </Grid>
//                 <Grid item xs={12} md={4}>
//                   <Button
//                     variant="contained"
//                     fullWidth
//                     onClick={generateWithAI}
//                     disabled={aiLoading || !aiPrompt.trim()}
//                     sx={{
//                       backgroundColor: "rgba(255,255,255,0.2)",
//                       color: "white",
//                       height: "56px",
//                       "&:hover": { backgroundColor: "rgba(255,255,255,0.3)" },
//                       "&:disabled": { backgroundColor: "rgba(255,255,255,0.1)" },
//                     }}
//                     startIcon={aiLoading ? <CircularProgress size={16} color="inherit" /> : <Send size={16} />}
//                   >
//                     {aiLoading ? "מעצב..." : "AI עצב עם"}
//                   </Button>
//                 </Grid>
//               </Grid>

//               <Collapse in={showAiExplanation}>
//                 <Alert
//                   severity="info"
//                   sx={{
//                     mt: 2,
//                     backgroundColor: "rgba(255,255,255,0.9)",
//                     "& .MuiAlert-icon": { color: "#f49b85" },
//                   }}
//                 >
//                   <Typography variant="body2">
//                     <strong>ה-AI בחר:</strong> {aiExplanation}
//                   </Typography>
//                 </Alert>
//               </Collapse>
//             </Card>
//           </Grid>
//         </Grid>

//         {/* תצוגת התמונות הזמינות */}
//         <Card sx={{ p: 3 }}>
//           <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//             <Palette size={20} color="#f49b85" />
//             התמונות באלבום
//           </Typography>
//           <Grid container spacing={2}>
//             {images.slice(0, 8).map((image) => (
//               <Grid item xs={6} sm={4} md={3} lg={2} key={image.id}>
//                 <Card
//                   sx={{
//                     transition: "all 0.3s ease",
//                     "&:hover": {
//                       transform: "scale(1.05)",
//                       boxShadow: "0 4px 12px rgba(244, 155, 133, 0.3)",
//                     },
//                     borderRadius: 2,
//                     overflow: "hidden",
//                   }}
//                 >
//                   <CardMedia
//                     component="img"
//                     height="100"
//                     image={image.s3URL}
//                     alt={image.name}
//                     sx={{ objectFit: "cover" }}
//                   />
//                 </Card>
//               </Grid>
//             ))}
//             {images.length > 8 && (
//               <Grid item xs={6} sm={4} md={3} lg={2}>
//                 <Card
//                   sx={{
//                     height: 100,
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     backgroundColor: "rgba(244, 155, 133, 0.1)",
//                     border: "2px dashed rgba(244, 155, 133, 0.3)",
//                     borderRadius: 2,
//                   }}
//                 >
//                   <Typography variant="body2" color="text.secondary" fontWeight="bold">
//                     +{images.length - 8} עוד
//                   </Typography>
//                 </Card>
//               </Grid>
//             )}
//           </Grid>
//         </Card>
//       </Box>
//     </motion.div>
//   )
// }

// export default CollageCreator


import { useState, useEffect, useReducer } from "react"
import axios from "axios"
import { useParams, useNavigate } from "react-router-dom"
import {
  Box,
  Button,
  Typography,
  Card,
  // הסרת Grid ושימוש ב-Box במקום
  Skeleton,
  Breadcrumbs,
  Chip,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Switch,
  FormControlLabel,
  CircularProgress,
  CardMedia,
  Tooltip,
  Divider,
  Stack,
} from "@mui/material"
import { Home, Wand2, Download, Palette, RefreshCw, Heart, Star, Circle, ContrastIcon as Gradient } from "lucide-react"
import { motion } from "framer-motion"
import { TextField, Alert, Collapse } from "@mui/material"
import { Sparkles, Send } from "lucide-react"

// שימוש ב-reducers הקיימים שלך
import { type Image, imageReducer, initialImageState } from "../../reducer/ImageReducer"
import {
  collageReducer,
  initialCollageState,
  type AIDesignResponse,
  applyAISettingsToState,
  validateAIResponse,
} from "../../reducer/CollageReducer"

const CollageCreator = () => {
  const { id } = useParams<{ id: string }>()
  const albumId = Number.parseInt(id || "0")
  const navigate = useNavigate()

  // שימוש ב-reducers
  const [images, dispatchImages] = useReducer(imageReducer, initialImageState)
  const [settings, dispatchSettings] = useReducer(collageReducer, initialCollageState)

  const [albumName, setAlbumName] = useState("")
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [generatedCollage, setGeneratedCollage] = useState<string | null>(null)
  const [aiPrompt, setAiPrompt] = useState("")
  const [aiLoading, setAiLoading] = useState(false)
  const [aiExplanation, setAiExplanation] = useState("")
  const [showAiExplanation, setShowAiExplanation] = useState(false)
  const [backgroundType, setBackgroundType] = useState<"solid" | "hearts" | "stars" | "dots" | "gradient">("solid")

  useEffect(() => {
    fetchAlbumData()
  }, [albumId])

  const fetchAlbumData = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`https://memoria-api-pukg.onrender.com/api/album/${albumId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const responseData = response.data as any
      setAlbumName(responseData.name)
      const activeImages = responseData.imageList?.filter((image: any) => !image.isDeleted) || []
      dispatchImages({ type: "SET_IMAGES", payload: activeImages })
    } catch (error) {
      console.error("שגיאה בטעינת נתוני האלבום:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateWithAI = async () => {
    if (!aiPrompt.trim()) {
      alert("אנא כתוב בקשה לעיצוב הקולאז'")
      return
    }

    console.log("🚀 Starting AI generation with prompt:", aiPrompt)
    setAiLoading(true)
    setShowAiExplanation(false)

    try {
      const token = localStorage.getItem("token")

      console.log("📡 Sending request to AI service...")
      const response = await axios.post(
        "https://memoria-api-pukg.onrender.com/api/AICollage/design",
        { prompt: aiPrompt },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      )

      console.log("✅ AI Response received:", response)
      console.log("📦 AI Response data:", response.data)

      const aiDesign = response.data as AIDesignResponse

      // וולידציה של תשובת ה-AI
      if (!validateAIResponse(aiDesign)) {
        console.error("❌ Invalid AI response")
        alert("התקבלה תשובה לא תקינה מה-AI")
        return
      }

      console.log("🤖 Valid AI Design Object:", aiDesign)

      // עדכון ההגדרות בפעולה אחת
      const newSettings = applyAISettingsToState(settings, aiDesign, images.length)
      console.log("🔄 New settings from AI:", newSettings)

      // עדכון ה-state עם הערכים החדשים
      if (newSettings.layout !== settings.layout) {
        console.log("📐 Setting layout to:", newSettings.layout)
        dispatchSettings({ type: "SET_LAYOUT", payload: newSettings.layout })
      }

      if (newSettings.style !== settings.style) {
        console.log("🎭 Setting style to:", newSettings.style)
        dispatchSettings({ type: "SET_STYLE", payload: newSettings.style })
      }

      if (newSettings.imageCount !== settings.imageCount) {
        console.log("📊 Setting imageCount to:", newSettings.imageCount)
        dispatchSettings({ type: "SET_IMAGE_COUNT", payload: newSettings.imageCount })
      }

      if (newSettings.spacing !== settings.spacing) {
        console.log("📏 Setting spacing to:", newSettings.spacing)
        dispatchSettings({ type: "SET_SPACING", payload: newSettings.spacing })
      }

      if (newSettings.borderRadius !== settings.borderRadius) {
        console.log("🔄 Setting borderRadius to:", newSettings.borderRadius)
        dispatchSettings({ type: "SET_BORDER_RADIUS", payload: newSettings.borderRadius })
      }

      if (newSettings.addText !== settings.addText) {
        console.log("📝 Setting addText to:", newSettings.addText)
        dispatchSettings({ type: "SET_ADD_TEXT", payload: newSettings.addText })
      }

      // עדכון backgroundType ו-explanation
      if (aiDesign.backgroundType) {
        console.log("🎨 Setting background type to:", aiDesign.backgroundType)
        setBackgroundType(aiDesign.backgroundType)
      }

      if (aiDesign.explanation) {
        setAiExplanation(aiDesign.explanation)
        setShowAiExplanation(true)
      }

      console.log("✅ All settings updated successfully")

      // יצירת הקולאז' עם הערכים החדשים
      console.log("🎨 Starting collage generation with AI values...")
      setTimeout(() => {
        generateCollageWithSettings(newSettings, aiDesign.backgroundType || backgroundType)
      }, 500)
    } catch (error) {
      console.error("❌ Error with AI:", error)
      alert("אירעה שגיאה בקבלת עיצוב מה-AI. נסה שוב.")
    } finally {
      setAiLoading(false)
    }
  }

  // פונקציה חדשה שמקבלת הגדרות ספציפיות
  const generateCollageWithSettings = async (customSettings?: any, customBgType?: string) => {
    if (images.length < 2) {
      alert("נדרשות לפחות 2 תמונות ליצירת קולאז'")
      return
    }

    const finalSettings = customSettings || settings
    const finalBgType = customBgType || backgroundType

    console.log("🎨 Starting collage generation...")
    console.log("📊 Using settings:", finalSettings)
    console.log("🎨 Using backgroundType:", finalBgType)

    setGenerating(true)

    try {
      // בחירת תמונות אקראיות לפי הגדרות המשתמש
      const selectedImages = images
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.min(finalSettings.imageCount, images.length))

      console.log("🖼️ Selected", selectedImages.length, "images for collage")

      // יצירת הקולאז' בפועל
      await createCollage(selectedImages, finalSettings, finalBgType)
    } catch (error) {
      console.error("שגיאה ביצירת הקולאז':", error)
      alert("אירעה שגיאה ביצירת הקולאז'. נסה שוב.")
    } finally {
      setGenerating(false)
    }
  }

  // פונקציה לטעינת תמונה דרך השרת שלך
  const loadImageViaProxy = async (imageUrl: string): Promise<HTMLImageElement> => {
    return new Promise(async (resolve, reject) => {
      try {
        const token = localStorage.getItem("token")

        // קבלת התמונה דרך השרת שלך
        const response = await axios.get("https://memoria-api-pukg.onrender.com/api/image/proxy", {
          params: { url: imageUrl },
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        })

        // יצירת URL זמני מה-blob
        const blob = response.data as Blob
        const blobUrl = URL.createObjectURL(blob)

        const image = new Image()
        image.crossOrigin = "anonymous"
        image.onload = () => {
          URL.revokeObjectURL(blobUrl)
          resolve(image)
        }
        image.onerror = () => {
          URL.revokeObjectURL(blobUrl)
          reject(new Error(`Failed to load image: ${imageUrl}`))
        }
        image.src = blobUrl
      } catch (error) {
        console.error("שגיאה בטעינת תמונה דרך proxy:", error)
        reject(error)
      }
    })
  }

  const generateCollage = async () => {
    await generateCollageWithSettings()
  }

  // פונקציה נפרדת לערבוב תמונות (ללא שינוי הגדרות)
  const shuffleAndGenerate = async () => {
    await generateCollageWithSettings()
  }

  const createCollage = async (selectedImages: Image[], customSettings?: any, customBgType?: string) => {
    const finalSettings = customSettings || settings
    const finalBgType = customBgType || backgroundType

    console.log("🎨 Creating collage with", selectedImages.length, "images")
    console.log("🎨 Background type:", finalBgType)
    console.log("📊 Settings:", finalSettings)

    // יצירת canvas לקולאז'
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    if (!ctx) return

    // הגדרת גודל הקנבס
    canvas.width = 800
    canvas.height = 600

    // רקע
    console.log("🎨 Drawing background with type:", finalBgType, "and style:", finalSettings.style)
    drawBackground(ctx, canvas.width, canvas.height, finalSettings.style, finalBgType)

    try {
      // טעינת התמונות דרך השרת
      const loadedImages: HTMLImageElement[] = []

      for (const img of selectedImages) {
        try {
          console.log(`טוען תמונה: ${img.s3URL}`)
          const image = await loadImageViaProxy(img.s3URL)
          loadedImages.push(image)
          console.log(`תמונה נטענה בהצלחה: ${img.name}`)
        } catch (error) {
          console.warn(`נכשל בטעינת תמונה: ${img.name}`, error)
          // ממשיך לתמונה הבאה
        }
      }

      if (loadedImages.length === 0) {
        throw new Error("לא ניתן לטעון אף תמונה")
      }

      console.log(`נטענו ${loadedImages.length} תמונות מתוך ${selectedImages.length}`)

      // יצירת הפריסה לפי הסגנון שנבחר
      switch (finalSettings.layout) {
        case "grid":
          drawGridLayout(ctx, loadedImages, canvas.width, canvas.height, finalSettings)
          break
        case "mosaic":
          drawMosaicLayout(ctx, loadedImages, canvas.width, canvas.height, finalSettings)
          break
        case "artistic":
          drawArtisticLayout(ctx, loadedImages, canvas.width, canvas.height, finalSettings)
          break
        case "magazine":
          drawMagazineLayout(ctx, loadedImages, canvas.width, canvas.height, finalSettings)
          break
      }

      // הוספת טקסט אם נדרש
      if (finalSettings.addText) {
        addTextToCollage(ctx, albumName, canvas.width, canvas.height, finalSettings)
      }

      // המרה ל-base64
      const collageDataUrl = canvas.toDataURL("image/png")
      setGeneratedCollage(collageDataUrl)
      console.log("✅ קולאז' נוצר בהצלחה!")
    } catch (error) {
      console.error("שגיאה ביצירת הקולאז':", error)
      throw error
    }
  }

  const getBackgroundColor = (style: string): string => {
    switch (style) {
      case "vintage":
        return "#f4f1e8"
      case "minimalist":
        return "#ffffff"
      case "vibrant":
        return "#f0f8ff"
      default:
        return "#fafafa"
    }
  }

  const drawGridLayout = (
    ctx: CanvasRenderingContext2D,
    images: HTMLImageElement[],
    width: number,
    height: number,
    customSettings?: any,
  ) => {
    const finalSettings = customSettings || settings
    const cols = Math.ceil(Math.sqrt(images.length))
    const rows = Math.ceil(images.length / cols)
    const cellWidth = (width - finalSettings.spacing * (cols + 1)) / cols
    const cellHeight = (height - finalSettings.spacing * (rows + 1)) / rows

    images.forEach((img, index) => {
      const col = index % cols
      const row = Math.floor(index / cols)
      const x = finalSettings.spacing + col * (cellWidth + finalSettings.spacing)
      const y = finalSettings.spacing + row * (cellHeight + finalSettings.spacing)

      // עיגול פינות
      if (finalSettings.borderRadius > 0) {
        ctx.save()
        roundRect(ctx, x, y, cellWidth, cellHeight, finalSettings.borderRadius)
        ctx.clip()
      }

      ctx.drawImage(img, x, y, cellWidth, cellHeight)

      if (finalSettings.borderRadius > 0) {
        ctx.restore()
      }
    })
  }

  const drawMosaicLayout = (
    ctx: CanvasRenderingContext2D,
    images: HTMLImageElement[],
    width: number,
    height: number,
    customSettings?: any,
  ) => {
    const finalSettings = customSettings || settings
    // פריסת פסיפס אקראית
    const positions = generateMosaicPositions(images.length, width, height)

    images.forEach((img, index) => {
      const pos = positions[index]
      if (pos) {
        ctx.save()
        if (finalSettings.borderRadius > 0) {
          roundRect(ctx, pos.x, pos.y, pos.width, pos.height, finalSettings.borderRadius)
          ctx.clip()
        }
        ctx.drawImage(img, pos.x, pos.y, pos.width, pos.height)
        ctx.restore()
      }
    })
  }

  const drawArtisticLayout = (
    ctx: CanvasRenderingContext2D,
    images: HTMLImageElement[],
    width: number,
    height: number,
    customSettings?: any,
  ) => {
    const finalSettings = customSettings || settings
    // פריסה אמנותית עם זוויות וחפיפות
    images.forEach((img) => {
      const angle = (Math.random() - 0.5) * 0.3 // זווית קלה
      const scale = 0.7 + Math.random() * 0.3
      const x = Math.random() * (width * 0.6) + width * 0.2
      const y = Math.random() * (height * 0.6) + height * 0.2
      const imgWidth = (width / 3) * scale
      const imgHeight = (height / 3) * scale

      ctx.save()
      ctx.translate(x + imgWidth / 2, y + imgHeight / 2)
      ctx.rotate(angle)

      if (finalSettings.borderRadius > 0) {
        roundRect(ctx, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight, finalSettings.borderRadius)
        ctx.clip()
      }

      ctx.drawImage(img, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight)
      ctx.restore()
    })
  }

  const drawMagazineLayout = (
    ctx: CanvasRenderingContext2D,
    images: HTMLImageElement[],
    width: number,
    height: number,
    customSettings?: any,
  ) => {
    const finalSettings = customSettings || settings
    // פריסת מגזין עם תמונה מרכזית גדולה
    if (images.length === 0) return

    // תמונה מרכזית
    const mainImg = images[0]
    const mainWidth = width * 0.6
    const mainHeight = height * 0.7
    const mainX = (width - mainWidth) / 2
    const mainY = (height - mainHeight) / 2

    ctx.save()
    if (finalSettings.borderRadius > 0) {
      roundRect(ctx, mainX, mainY, mainWidth, mainHeight, finalSettings.borderRadius)
      ctx.clip()
    }
    ctx.drawImage(mainImg, mainX, mainY, mainWidth, mainHeight)
    ctx.restore()

    // תמונות קטנות בצדדים
    const sideImages = images.slice(1)
    const sideWidth = width * 0.15
    const sideHeight = height * 0.2

    sideImages.forEach((img, index) => {
      const isLeft = index % 2 === 0
      const x = isLeft ? finalSettings.spacing : width - sideWidth - finalSettings.spacing
      const y = finalSettings.spacing + index * (sideHeight + finalSettings.spacing)

      if (y + sideHeight <= height - finalSettings.spacing) {
        ctx.save()
        if (finalSettings.borderRadius > 0) {
          roundRect(ctx, x, y, sideWidth, sideHeight, finalSettings.borderRadius)
          ctx.clip()
        }
        ctx.drawImage(img, x, y, sideWidth, sideHeight)
        ctx.restore()
      }
    })
  }

  const generateMosaicPositions = (count: number, width: number, height: number) => {
    const positions = []
    const minSize = Math.min(width, height) * 0.15
    const maxSize = Math.min(width, height) * 0.4

    for (let i = 0; i < count; i++) {
      const size = minSize + Math.random() * (maxSize - minSize)
      const x = Math.random() * (width - size)
      const y = Math.random() * (height - size)

      positions.push({
        x,
        y,
        width: size,
        height: size,
      })
    }

    return positions
  }

  const roundRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
  ) => {
    ctx.beginPath()
    ctx.moveTo(x + radius, y)
    ctx.lineTo(x + width - radius, y)
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
    ctx.lineTo(x + width, y + height - radius)
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
    ctx.lineTo(x + radius, y + height)
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
    ctx.lineTo(x, y + radius)
    ctx.quadraticCurveTo(x, y, x + radius, y)
    ctx.closePath()
  }

  const addTextToCollage = (
    ctx: CanvasRenderingContext2D,
    text: string,
    width: number,
    height: number,
    customSettings?: any,
  ) => {
    const finalSettings = customSettings || settings
    ctx.save()
    ctx.font = "bold 24px Arial"
    ctx.fillStyle = finalSettings.style === "minimalist" ? "#333" : "#fff"
    ctx.strokeStyle = finalSettings.style === "minimalist" ? "#fff" : "#333"
    ctx.lineWidth = 2
    ctx.textAlign = "center"

    const x = width / 2
    const y = height - 30

    ctx.strokeText(text, x, y)
    ctx.fillText(text, x, y)
    ctx.restore()
  }

  const downloadCollage = () => {
    if (!generatedCollage) return

    const link = document.createElement("a")
    link.download = `${albumName}-collage.png`
    link.href = generatedCollage
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const drawBackground = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    style: string,
    bgType: string,
  ) => {
    console.log("🎨 Drawing background - style:", style, "bgType:", bgType)

    // רקע בסיסי
    ctx.fillStyle = getBackgroundColor(style)
    ctx.fillRect(0, 0, width, height)

    // הוספת דקורציות
    switch (bgType) {
      case "hearts":
        console.log("💕 Drawing hearts background")
        drawHearts(ctx, width, height)
        break
      case "stars":
        console.log("⭐ Drawing stars background")
        drawStars(ctx, width, height)
        break
      case "dots":
        console.log("🔵 Drawing dots background")
        drawDots(ctx, width, height)
        break
      case "gradient":
        console.log("🌈 Drawing gradient background")
        drawGradientBackground(ctx, width, height, style)
        break
      default:
        console.log("⚪ Drawing solid background")
    }
  }

  const drawHearts = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = "rgba(255, 182, 193, 0.4)" // ורוד בהיר שקוף

    for (let i = 0; i < 25; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      const size = 8 + Math.random() * 16

      // ציור לב משופר
      ctx.save()
      ctx.translate(x, y)
      ctx.beginPath()
      ctx.arc(-size / 4, -size / 4, size / 4, 0, Math.PI * 2)
      ctx.arc(size / 4, -size / 4, size / 4, 0, Math.PI * 2)
      ctx.moveTo(-size / 2, 0)
      ctx.lineTo(0, size / 2)
      ctx.lineTo(size / 2, 0)
      ctx.fill()
      ctx.restore()
    }
  }

  const drawStars = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = "rgba(255, 215, 0, 0.5)" // זהב שקוף

    for (let i = 0; i < 35; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      const size = 4 + Math.random() * 12

      // ציור כוכב משופר
      ctx.save()
      ctx.translate(x, y)
      ctx.beginPath()
      for (let j = 0; j < 5; j++) {
        const angle = (j * Math.PI * 2) / 5 - Math.PI / 2
        const radius = j % 2 === 0 ? size : size / 2
        const px = Math.cos(angle) * radius
        const py = Math.sin(angle) * radius
        if (j === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    }
  }

  const drawDots = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = "rgba(100, 149, 237, 0.4)" // כחול שקוף

    for (let i = 0; i < 60; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      const radius = 2 + Math.random() * 6

      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  const drawGradientBackground = (ctx: CanvasRenderingContext2D, width: number, height: number, style: string) => {
    const gradient = ctx.createLinearGradient(0, 0, width, height)

    switch (style) {
      case "vintage":
        gradient.addColorStop(0, "#f4f1e8")
        gradient.addColorStop(0.5, "#e8dcc0")
        gradient.addColorStop(1, "#d4c4a0")
        break
      case "vibrant":
        gradient.addColorStop(0, "#ff9a9e")
        gradient.addColorStop(0.5, "#fecfef")
        gradient.addColorStop(1, "#ffecd2")
        break
      case "minimalist":
        gradient.addColorStop(0, "#ffffff")
        gradient.addColorStop(0.5, "#f8f8f8")
        gradient.addColorStop(1, "#f0f0f0")
        break
      default:
        gradient.addColorStop(0, "#fafafa")
        gradient.addColorStop(0.5, "#f0f0f0")
        gradient.addColorStop(1, "#e0e0e0")
    }

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
  }

  const getBackgroundIcon = (type: string) => {
    switch (type) {
      case "hearts":
        return <Heart size={16} />
      case "stars":
        return <Star size={16} />
      case "dots":
        return <Circle size={16} />
      case "gradient":
        return <Gradient size={16} />
      default:
        return <Palette size={16} />
    }
  }

  const getBackgroundLabel = (type: string) => {
    switch (type) {
      case "hearts":
        return "לבבות 💕"
      case "stars":
        return "כוכבים ⭐"
      case "dots":
        return "נקודות 🔵"
      case "gradient":
        return "גרדיאנט 🌈"
      default:
        return "רקע חלק"
    }
  }

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton width={200} height={30} sx={{ mb: 2 }} />
        <Skeleton width={300} height={20} sx={{ mb: 4 }} />
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {[1, 2, 3, 4].map((item) => (
            <Box key={item} sx={{ flex: "1 1 300px", minWidth: "300px" }}>
              <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
            </Box>
          ))}
        </Box>
      </Box>
    )
  }

  if (images.length < 2) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <Box sx={{ p: 3 }}>
          <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ mb: 2 }}>
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
                "&:hover": { color: "#df8670" },
              }}
            >
              <Home size={16} style={{ marginLeft: 4, color: "#df8670" }} />
              אלבומים
            </Typography>
            <Typography
              component="button"
              onClick={() => navigate(`/albums/${albumId}`)}
              sx={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "inherit",
                fontFamily: "inherit",
                "&:hover": { color: "#df8670" },
              }}
            >
              {albumName}
            </Typography>
            <Typography color="text.primary" fontWeight="medium">
              יוצר קולאז׳
            </Typography>
          </Breadcrumbs>

          <Paper
            elevation={0}
            sx={{ p: 4, textAlign: "center", borderRadius: 4, border: "1px dashed", borderColor: "divider" }}
          >
            <Palette size={64} color="#f49b85" />
            <Typography variant="h6" sx={{ mt: 2 }}>
              נדרשות לפחות 2 תמונות ליצירת קולאז'
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              העלה עוד תמונות לאלבום כדי ליצור קולאז'ים מרהיבים
            </Typography>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#f49b85" }}
              onClick={() => navigate(`/albums/${albumId}`)}
            >
              חזור לאלבום
            </Button>
          </Paper>
        </Box>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Box sx={{ p: 3 }}>
        <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ mb: 2 }}>
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
              "&:hover": { color: "#df8670" },
            }}
          >
            <Home size={16} style={{ marginLeft: 4, color: "#df8670" }} />
            אלבומים
          </Typography>
          <Typography
            component="button"
            onClick={() => navigate(`/albums/${albumId}`)}
            sx={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "inherit",
              fontFamily: "inherit",
              "&:hover": { color: "#df8670" },
            }}
          >
            {albumName}
          </Typography>
          <Typography color="text.primary" fontWeight="medium">
            יוצר קולאז׳
          </Typography>
        </Breadcrumbs>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Typography variant="h4" fontWeight="bold">
            יוצר קולאז'ים
          </Typography>
          <Stack direction="row" spacing={1}>
            <Chip
              label={`${images.length} תמונות זמינות`}
              size="small"
              variant="outlined"
              sx={{ color: "#df8670", borderColor: "#f49b85" }}
            />
            <Chip
              icon={getBackgroundIcon(backgroundType)}
              label={getBackgroundLabel(backgroundType)}
              size="small"
              sx={{ backgroundColor: "#f49b85", color: "white" }}
            />
          </Stack>
        </Box>

        {/* שורה ראשונה: קולאז' + הגדרות */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 3 }}>
          {/* תצוגת הקולאז' */}
          <Box sx={{ flex: "2 1 500px", minWidth: "300px" }}>
            <Card sx={{ p: 3, minHeight: 400 }}>
              {generatedCollage ? (
                <Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="h6">הקולאז' שלך</Typography>
                    <Button
                      variant="contained"
                      onClick={downloadCollage}
                      sx={{ backgroundColor: "#f49b85", "&:hover": { backgroundColor: "#df8670" } }}
                      startIcon={<Download size={16} />}
                    >
                      הורד
                    </Button>
                  </Box>
                  <Box sx={{ textAlign: "center" }}>
                    <img
                      src={generatedCollage || "/placeholder.svg"}
                      alt="Generated Collage"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "500px",
                        borderRadius: "12px",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                        border: "2px solid #f0f0f0",
                      }}
                    />
                  </Box>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 300,
                    color: "text.secondary",
                    background: "linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%)",
                    borderRadius: 2,
                    border: "2px dashed #e0e0e0",
                  }}
                >
                  <Palette size={64} color="#f49b85" />
                  <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
                    בחר הגדרות וצור את הקולאז' הראשון שלך
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, textAlign: "center", maxWidth: 300 }}>
                    השתמש ב-AI או בהגדרות הידניות ליצירת קולאז'ים יפים מהתמונות שלך
                  </Typography>
                </Box>
              )}
            </Card>
          </Box>

          {/* פאנל הגדרות */}
          <Box sx={{ flex: "1 1 300px", minWidth: "300px" }}>
            <Card sx={{ p: 3, height: "fit-content" }}>
              <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Wand2 size={20} color="#f49b85" />
                הגדרות קולאז׳
              </Typography>

              <Box sx={{ mt: 3 }}>
                {/* פריסה וסגנון */}
                <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                  <Box sx={{ flex: 1 }}>
                    <FormControl fullWidth>
                      <InputLabel>פריסה</InputLabel>
                      <Select
                        value={settings.layout}
                        label="פריסה"
                        onChange={(e) => dispatchSettings({ type: "SET_LAYOUT", payload: e.target.value as any })}
                      >
                        <MenuItem value="grid">רשת</MenuItem>
                        <MenuItem value="mosaic">פסיפס</MenuItem>
                        <MenuItem value="artistic">אמנותי</MenuItem>
                        <MenuItem value="magazine">מגזין</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <FormControl fullWidth>
                      <InputLabel>סגנון</InputLabel>
                      <Select
                        value={settings.style}
                        label="סגנון"
                        onChange={(e) => dispatchSettings({ type: "SET_STYLE", payload: e.target.value as any })}
                      >
                        <MenuItem value="modern">מודרני</MenuItem>
                        <MenuItem value="vintage">וינטג'</MenuItem>
                        <MenuItem value="minimalist">מינימליסטי</MenuItem>
                        <MenuItem value="vibrant">צבעוני</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* סוג רקע */}
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>סוג רקע</InputLabel>
                  <Select
                    value={backgroundType}
                    label="סוג רקע"
                    onChange={(e) => setBackgroundType(e.target.value as any)}
                    renderValue={(value) => (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {getBackgroundIcon(value)}
                        {getBackgroundLabel(value)}
                      </Box>
                    )}
                  >
                    <MenuItem value="solid">
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Palette size={16} />
                        רקע חלק
                      </Box>
                    </MenuItem>
                    <MenuItem value="hearts">
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Heart size={16} />
                        לבבות 💕
                      </Box>
                    </MenuItem>
                    <MenuItem value="stars">
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Star size={16} />
                        כוכבים ⭐
                      </Box>
                    </MenuItem>
                    <MenuItem value="dots">
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Circle size={16} />
                        נקודות 🔵
                      </Box>
                    </MenuItem>
                    <MenuItem value="gradient">
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Gradient size={16} />
                        גרדיאנט 🌈
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>

                <Divider sx={{ my: 2 }} />

                {/* מספר תמונות */}
                <Typography gutterBottom>מספר תמונות: {settings.imageCount}</Typography>
                <Slider
                  value={settings.imageCount}
                  onChange={(_, value) => dispatchSettings({ type: "SET_IMAGE_COUNT", payload: value as number })}
                  min={2}
                  max={Math.min(images.length, 12)}
                  marks
                  valueLabelDisplay="auto"
                  sx={{ mb: 3, color: "#f49b85" }}
                />

                {/* רווחים */}
                <Typography gutterBottom>רווחים: {settings.spacing}px</Typography>
                <Slider
                  value={settings.spacing}
                  onChange={(_, value) => dispatchSettings({ type: "SET_SPACING", payload: value as number })}
                  min={0}
                  max={30}
                  valueLabelDisplay="auto"
                  sx={{ mb: 3, color: "#f49b85" }}
                />

                {/* עיגול פינות */}
                <Typography gutterBottom>עיגול פינות: {settings.borderRadius}px</Typography>
                <Slider
                  value={settings.borderRadius}
                  onChange={(_, value) => dispatchSettings({ type: "SET_BORDER_RADIUS", payload: value as number })}
                  min={0}
                  max={20}
                  valueLabelDisplay="auto"
                  sx={{ mb: 3, color: "#f49b85" }}
                />

                {/* הוסף כותרת */}
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.addText}
                      onChange={(e) => dispatchSettings({ type: "SET_ADD_TEXT", payload: e.target.checked })}
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": {
                          color: "#f49b85",
                        },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                          backgroundColor: "#f49b85",
                        },
                      }}
                    />
                  }
                  label="הוסף כותרת"
                  sx={{ mb: 3 }}
                />

                <Divider sx={{ my: 2 }} />

                {/* כפתורי פעולה */}
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={generateCollage}
                    disabled={generating}
                    sx={{ backgroundColor: "#f49b85", "&:hover": { backgroundColor: "#df8670" } }}
                    startIcon={generating ? <CircularProgress size={16} color="inherit" /> : <Wand2 size={16} />}
                  >
                    {generating ? "יוצר..." : "צור קולאז"}
                  </Button>

                  <Tooltip title="ערבב תמונות וצור קולאז' חדש">
                    <Button
                      variant="outlined"
                      onClick={shuffleAndGenerate}
                      disabled={generating}
                      sx={{
                        color: "#f49b85",
                        borderColor: "#f49b85",
                        minWidth: "auto",
                        px: 2,
                        "&:hover": { borderColor: "#df8670", backgroundColor: "rgba(244, 155, 133, 0.1)" },
                      }}
                    >
                      <RefreshCw size={16} />
                    </Button>
                  </Tooltip>
                </Box>
              </Box>
            </Card>
          </Box>
        </Box>

        {/* שורה שנייה: פיצ'ר AI */}
        <Box sx={{ mb: 3 }}>
          <Card sx={{ p: 3, background: "linear-gradient(135deg, #f49b85 0%, #df8670 100%)", color: "white" }}>
            <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Sparkles size={20} />
              AI עיצוב עם
            </Typography>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "flex-end" }}>
              <Box sx={{ flex: "1 1 300px", minWidth: "300px" }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder='"לדוגמה: "צור קולאז׳ רומנטי עם 4 תמונות ורקע עם לבבות" או "קולאז׳ משפחתי עם כוכבים '
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "rgba(255,255,255,0.9)",
                      "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                      "&:hover fieldset": { borderColor: "rgba(255,255,255,0.5)" },
                      "&.Mui-focused fieldset": { borderColor: "white" },
                    },
                  }}
                />
              </Box>
              <Box sx={{ flex: "0 1 200px", minWidth: "200px" }}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={generateWithAI}
                  disabled={aiLoading || !aiPrompt.trim()}
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.2)",
                    color: "white",
                    height: "56px",
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.3)" },
                    "&:disabled": { backgroundColor: "rgba(255,255,255,0.1)" },
                  }}
                  startIcon={aiLoading ? <CircularProgress size={16} color="inherit" /> : <Send size={16} />}
                >
                  {aiLoading ? "מעצב..." : "AI עצב עם"}
                </Button>
              </Box>
            </Box>

            <Collapse in={showAiExplanation}>
              <Alert
                severity="info"
                sx={{
                  mt: 2,
                  backgroundColor: "rgba(255,255,255,0.9)",
                  "& .MuiAlert-icon": { color: "#f49b85" },
                }}
              >
                <Typography variant="body2">
                  <strong>ה-AI בחר:</strong> {aiExplanation}
                </Typography>
              </Alert>
            </Collapse>
          </Card>
        </Box>

        {/* תצוגת התמונות הזמינות */}
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Palette size={20} color="#f49b85" />
            התמונות באלבום
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {images.slice(0, 8).map((image) => (
              <Box
                key={image.id}
                sx={{
                  flex: "0 0 auto",
                  width: {
                    xs: "calc(50% - 8px)",
                    sm: "calc(33.33% - 8px)",
                    md: "calc(25% - 8px)",
                    lg: "calc(16.66% - 8px)",
                  },
                }}
              >
                <Card
                  sx={{
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: "0 4px 12px rgba(244, 155, 133, 0.3)",
                    },
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <CardMedia
                    component="img"
                    height="100"
                    image={image.s3URL}
                    alt={image.name}
                    sx={{ objectFit: "cover" }}
                  />
                </Card>
              </Box>
            ))}
            {images.length > 8 && (
              <Box
                sx={{
                  flex: "0 0 auto",
                  width: {
                    xs: "calc(50% - 8px)",
                    sm: "calc(33.33% - 8px)",
                    md: "calc(25% - 8px)",
                    lg: "calc(16.66% - 8px)",
                  },
                }}
              >
                <Card
                  sx={{
                    height: 100,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(244, 155, 133, 0.1)",
                    border: "2px dashed rgba(244, 155, 133, 0.3)",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body2" color="text.secondary" fontWeight="bold">
                    +{images.length - 8} עוד
                  </Typography>
                </Card>
              </Box>
            )}
          </Box>
        </Card>
      </Box>
    </motion.div>
  )
}

export default CollageCreator
