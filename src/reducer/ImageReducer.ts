export type Image = {
    id: number; // מזהה ייחודי של התמונה
    name: string; // שם התמונה
    s3URL: string; // כתובת URL של התמונה ב-S3
    size: number; // גודל התמונה בבתים
    albumId?: number; // מזהה ייחודי של האלבום שבו נמצאת התמונה
    isDeleted?: boolean; // האם התמונה נמחקה
};
export type ImageAction =
    | { type: 'SET_IMAGES'; payload: Image[] }
    | { type: 'CREATE_IMAGE'; payload: Image }
    | { type: 'UPDATE_IMAGE'; payload: Partial<Image> & { id: number } }
    | { type: 'DELETE_IMAGE'; payload: { id: number } };
export const initialImageState: Image[] = [];
export const imageReducer = (state: Image[] = initialImageState, action: ImageAction): Image[] => {
    switch (action.type) {
        case 'SET_IMAGES':
            return action.payload.filter(image => !image.isDeleted); // מסנן תמונות מחוקות;
        case 'CREATE_IMAGE':
            return [...state, action.payload];
        case 'UPDATE_IMAGE':
            return state.map((image) =>
                image.id === action.payload.id ? { ...image, ...action.payload } : image
            );
        case 'DELETE_IMAGE':
            return state.filter((image) => image.id !== action.payload.id);
        default:
            return state;
    }
};