import React, { createContext, useReducer, ReactNode, Dispatch } from 'react';
import { initialState, UserAction, userReducer, User } from '../reducer/UserReducer';


export const UserContext = createContext<{
  user: User;
  dispatch: Dispatch<UserAction>;
}>({
  user: initialState,
  dispatch: () => {},
});
interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, dispatch] = useReducer(userReducer, initialState);

  return (
    <UserContext value={{ user, dispatch }}>
      {children}
    </UserContext>
  );
};


export default UserContext;
