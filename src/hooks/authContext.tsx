import { createContext, type ReactNode, useState } from 'react'

// Interfaces + Types
interface User {
  email: string | null;
  name: string | null;
  photo: string | null;
}

type UserType = User | undefined;

interface AuthProvider {
  user: UserType;
  setUser: (user: UserType) => void;
}

interface Props {
  children: ReactNode
}

// Constant
const USER_SESSION_KEY = 'user';

export const AuthContext = createContext<AuthProvider>({ user: undefined, setUser: () => {} })

const getUserFromSession = () => {
  const user = sessionStorage.getItem(USER_SESSION_KEY)
  if (user) return JSON.parse(user)

  return undefined;
}

const setUserToSession = (nextUser: UserType) => {
  if (!nextUser) sessionStorage.removeItem(USER_SESSION_KEY);
  else sessionStorage.setItem(USER_SESSION_KEY, JSON.stringify(nextUser))
}

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<UserType>(getUserFromSession())

  const updateUser = (nextUser: UserType) => {
    setUserToSession(nextUser);
    setUser(nextUser);
  }

  return (
    <AuthContext.Provider value={{ user, setUser: updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}
