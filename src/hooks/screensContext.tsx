import { createContext, type ReactNode, useState } from 'react'
import { ScreensProviderInterface, ScreensType } from '../typesInterfaces/screenAndSection';

export const ScreensContext = createContext<ScreensProviderInterface>({ screensStore: undefined, setScreensStore: () => {}  })

interface Props {
  children: ReactNode
}

export const ScreensProvider = ({ children }: Props) => {
  const [screensStore, setScreensStore] = useState<ScreensType>(undefined)

  return (
    <ScreensContext.Provider value={{ screensStore, setScreensStore }}>
      {children}
    </ScreensContext.Provider>
  )
}
