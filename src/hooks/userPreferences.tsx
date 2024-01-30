import { createContext, type ReactNode, useState } from 'react'
import { UserPreferenceProviderInterface, UserPreferenceType } from '../typesInterfaces/userPreference';

export const UserPreferencesContext = createContext<UserPreferenceProviderInterface>({ userPreferenceStore: undefined, setUserPreferenceStore: () => {}  })

interface Props {
  children: ReactNode
}

export const UserPreferenceProvider = ({ children }: Props) => {
  const [userPreferenceStore, setUserPreferenceStore] = useState<UserPreferenceType>(undefined)

  return (
    <UserPreferencesContext.Provider value={{ userPreferenceStore, setUserPreferenceStore }}>
      {children}
    </UserPreferencesContext.Provider>
  )
}
