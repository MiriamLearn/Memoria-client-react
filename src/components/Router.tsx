///////--------------------goood version without homePage
// import { createBrowserRouter } from "react-router-dom";
// import FileUploader from "./Files/FileUpLoader";
// import AlbumList from "./Folders/AlbumList";
// import AlbumPage from "./Folders/AlbumPage";
// import CollageCreator from "./Folders/CollageCreator";

// const Router = createBrowserRouter([
//     { path: '/', element: <AlbumList /> },
//     { path: 'albums/:id', element: <AlbumPage /> },
//     { path: 'albums/:id/upload', element: <FileUploader /> },
//     { path: "/albums/:id/collage", element: <CollageCreator />}
// ]);

// export default Router;



// // import { createBrowserRouter } from "react-router-dom"
// // import FileUploader from "./Files/FileUpLoader"
// // import AlbumList from "./Folders/AlbumList"
// // import AlbumPage from "./Folders/AlbumPage"
// // import CollageCreator from "./Folders/CollageCreator"
// // import HomePage from "./Folders/HomePage"

// // const Router = createBrowserRouter([
// //   { path: "/", element: <HomePage /> },
// //   { path: "/albums", element: <AlbumList /> },
// //   { path: "/albums/:id", element: <AlbumPage /> },
// //   { path: "/albums/:id/upload", element: <FileUploader /> },
// //   { path: "/albums/:id/collage", element: <CollageCreator /> },
// // ])

// // export default Router






////////+++++++++++++++++++++++homePage
import { createBrowserRouter, Outlet } from "react-router-dom"
import UserAvatar from "./UserAvatar"
import { Box } from "@mui/material"
import HomePage from "./Folders/HomePage"
import AlbumList from "./Folders/AlbumList"
import AlbumPage from "./Folders/AlbumPage"
import FileUploader from "./Files/FileUpLoader"
import CollageCreator from "./Folders/CollageCreator"
// import ProfilePage from "./ProfilePage"

function Layout({ onLogout }: { onLogout: () => void }) {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    mb: 4,
                    position: "sticky",
                    top: 0,
                    zIndex: 1100,
                    py: 2,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    backgroundColor: "background.default",
                }}
            >
                <UserAvatar onLogout={onLogout} />
            </Box>

            <Box sx={{ flexGrow: 1 }}>
                <Outlet />
            </Box>
        </Box>
    )
}

const router = createBrowserRouter([
    {
        element: <Layout onLogout={() => {
            localStorage.removeItem("token")
            localStorage.removeItem("userId")
            window.location.reload()  // או כל דרך שתעדכן את ה־App שהמשתמש התנתק
        }} />,
        children: [
            {path: "/",element: <HomePage />,},
            { path: "/albums", element: <AlbumList /> },
            { path: "/albums/:id", element: <AlbumPage /> },
            { path: "/albums/:id/upload", element: <FileUploader /> },
            { path: "/albums/:id/collage", element: <CollageCreator /> },
            //   {
            //     path: "/profile",
            //     element: <ProfilePage />,
            //   },
            // נתיבים נוספים
        ],
    },
])

export default router
