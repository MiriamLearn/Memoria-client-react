import { createBrowserRouter } from "react-router-dom";
import FileUploader from "./Files/FileUpLoader";
import AlbumList from "./Folders/AlbumList";
import AlbumPage from "./Folders/AlbumPage";

const Router = createBrowserRouter([
    { path: '/', element: <AlbumList/> },
    { path: 'albums/:id', element: <AlbumPage/> },
    { path: 'albums/:id/upload', element: <FileUploader/> },
]); 

export default Router;