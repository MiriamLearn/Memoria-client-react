
export type User = {
    id:number
    name: string;
    email: string;
    password: string;
  };
  export type UserAction =
    | { type: 'CREATE_USER'; payload: User }
    | { type: 'UPDATE_USER'; payload: Partial<User> }
    | { type: 'RESET_USER' };
  
  export const initialState: User = {
    id:0,
    name: "",
    email: "",
    password: "",
  };
  
  export const userReducer = (state: User, action: UserAction): User => {
    switch (action.type) {
      case 'CREATE_USER':
        return { ...state, ...action.payload };
      case 'UPDATE_USER':
        return { ...state, ...action.payload };
      case 'RESET_USER':
        return initialState;
      default:
        return state;
    }
  };
  