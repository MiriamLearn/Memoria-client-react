import { createBrowserRouter } from "react-router-dom";
import FileUploader from "./Files/FileUpLoader";
import AlbumList from "./Folders/AlbumList";
import AlbumPage from "./Folders/AlbumPage";
import CollageCreator from "./Folders/CollageCreator";

const Router = createBrowserRouter([
    { path: '/', element: <AlbumList /> },
    { path: 'albums/:id', element: <AlbumPage /> },
    { path: 'albums/:id/upload', element: <FileUploader /> },
    { path: "/albums/:id/collage", element: <CollageCreator />}
]);

export default Router;



