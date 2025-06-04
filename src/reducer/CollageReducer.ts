// export type CollageSettings = {
//     layout: "grid" | "mosaic" | "artistic" | "magazine"
//     imageCount: number
//     style: "modern" | "vintage" | "minimalist" | "vibrant"
//     spacing: number
//     borderRadius: number
//     addText: boolean
//   }
  
//   export type CollageAction =
//     | { type: "SET_LAYOUT"; payload: CollageSettings["layout"] }
//     | { type: "SET_IMAGE_COUNT"; payload: number }
//     | { type: "SET_STYLE"; payload: CollageSettings["style"] }
//     | { type: "SET_SPACING"; payload: number }
//     | { type: "SET_BORDER_RADIUS"; payload: number }
//     | { type: "SET_ADD_TEXT"; payload: boolean }
//     | { type: "RESET_SETTINGS" }
  
//   export const initialCollageState: CollageSettings = {
//     layout: "grid",
//     imageCount: 4,
//     style: "modern",
//     spacing: 10,
//     borderRadius: 8,
//     addText: false,
//   }
  
//   export const collageReducer = (
//     state: CollageSettings = initialCollageState,
//     action: CollageAction,
//   ): CollageSettings => {
//     switch (action.type) {
//       case "SET_LAYOUT":
//         return { ...state, layout: action.payload }
//       case "SET_IMAGE_COUNT":
//         return { ...state, imageCount: action.payload }
//       case "SET_STYLE":
//         return { ...state, style: action.payload }
//       case "SET_SPACING":
//         return { ...state, spacing: action.payload }
//       case "SET_BORDER_RADIUS":
//         return { ...state, borderRadius: action.payload }
//       case "SET_ADD_TEXT":
//         return { ...state, addText: action.payload }
//       case "RESET_SETTINGS":
//         return initialCollageState
//       default:
//         return state
//     }
//   }
export type CollageSettings = {
  layout: "grid" | "mosaic" | "artistic" | "magazine"
  imageCount: number
  style: "modern" | "vintage" | "minimalist" | "vibrant"
  spacing: number
  borderRadius: number
  addText: boolean
}

// הרחבת הטיפוס לתשובת AI
export interface AIDesignResponse extends Partial<CollageSettings> {
  backgroundType?: "solid" | "hearts" | "stars" | "dots" | "gradient"
  explanation?: string
}

export type CollageAction =
  | { type: "SET_LAYOUT"; payload: CollageSettings["layout"] }
  | { type: "SET_IMAGE_COUNT"; payload: number }
  | { type: "SET_STYLE"; payload: CollageSettings["style"] }
  | { type: "SET_SPACING"; payload: number }
  | { type: "SET_BORDER_RADIUS"; payload: number }
  | { type: "SET_ADD_TEXT"; payload: boolean }
  | { type: "RESET_SETTINGS" }

export const initialCollageState: CollageSettings = {
  layout: "grid",
  imageCount: 4,
  style: "modern",
  spacing: 10,
  borderRadius: 8,
  addText: false,
}

export const collageReducer = (
  state: CollageSettings = initialCollageState,
  action: CollageAction,
): CollageSettings => {
  switch (action.type) {
    case "SET_LAYOUT":
      return { ...state, layout: action.payload }
    case "SET_IMAGE_COUNT":
      return { ...state, imageCount: action.payload }
    case "SET_STYLE":
      return { ...state, style: action.payload }
    case "SET_SPACING":
      return { ...state, spacing: action.payload }
    case "SET_BORDER_RADIUS":
      return { ...state, borderRadius: action.payload }
    case "SET_ADD_TEXT":
      return { ...state, addText: action.payload }
    case "RESET_SETTINGS":
      return initialCollageState
    default:
      return state
  }
}

// פונקציות עזר לעבודה עם AI response
export const applyAISettingsToState = (
  currentState: CollageSettings,
  aiResponse: AIDesignResponse,
  maxImages: number,
): CollageSettings => {
  return {
    ...currentState,
    layout: aiResponse.layout || currentState.layout,
    style: aiResponse.style || currentState.style,
    imageCount: aiResponse.imageCount ? Math.min(aiResponse.imageCount, maxImages) : currentState.imageCount,
    spacing: aiResponse.spacing !== undefined ? aiResponse.spacing : currentState.spacing,
    borderRadius: aiResponse.borderRadius !== undefined ? aiResponse.borderRadius : currentState.borderRadius,
    addText: aiResponse.addText !== undefined ? aiResponse.addText : currentState.addText,
  }
}

// פונקציה לוולידציה של AI response
export const validateAIResponse = (response: any): response is AIDesignResponse => {
  if (!response || typeof response !== "object") {
    return false
  }

  // בדיקת טיפוסים אופציונלית
  if (response.layout && !["grid", "mosaic", "artistic", "magazine"].includes(response.layout)) {
    return false
  }

  if (response.style && !["modern", "vintage", "minimalist", "vibrant"].includes(response.style)) {
    return false
  }

  if (response.backgroundType && !["solid", "hearts", "stars", "dots", "gradient"].includes(response.backgroundType)) {
    return false
  }

  return true
}
