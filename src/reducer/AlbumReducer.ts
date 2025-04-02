import {Image} from '../reducer/ImageReducer';

export type Album = {
    id: number;
    name: string;
    imageList: Image[]
};

export type AlbumAction =
    | { type: 'SET_ALBUMS'; payload: Album[] }
    | { type: 'CREATE_ALBUM'; payload: Album }
    | { type: 'DELETE_ALBUM'; payload: number }
    | { type: 'UPDATE_ALBUM'; payload: Album };

export const initialAlbumState: Album[] = [];

export const albumReducer = (state: Album[], action: AlbumAction): Album[] => {
    switch (action.type) {
        case 'SET_ALBUMS':
            return action.payload;
        case 'CREATE_ALBUM':
            return [...state, action.payload];
        case 'UPDATE_ALBUM':
            return state.map((album) =>
                album.id === action.payload.id ? { ...album, ...action.payload } : album
            );
        case 'DELETE_ALBUM':
            return state.filter(album => album.id !== action.payload);
        default:
            return state;
    }
};