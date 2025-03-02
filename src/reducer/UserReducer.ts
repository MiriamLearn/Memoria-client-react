
export type User = {
    id:number
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    address: string;
    phone: string;
  };
  export type UserAction =
    | { type: 'CREATE_USER'; payload: User }
    | { type: 'UPDATE_USER'; payload: Partial<User> }
    | { type: 'RESET_USER' };
  
  export const initialState: User = {
    id:0,
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    address: "",
    phone: ""
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
  