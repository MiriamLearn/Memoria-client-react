export type CollageSettings = {
    layout: "grid" | "mosaic" | "artistic" | "magazine"
    imageCount: number
    style: "modern" | "vintage" | "minimalist" | "vibrant"
    spacing: number
    borderRadius: number
    addText: boolean
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
  