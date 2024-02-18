import { createContext, type ReactNode, useState } from 'react'
import { ImagesInterface } from '../typesInterfaces/images';

interface ImagesProvider {
  imagesStore: ImagesInterface | undefined;
  setImagesStore: (data: ImagesInterface | undefined) => void;
}

export const ImagesContext = createContext<ImagesProvider>({ imagesStore: undefined, setImagesStore: () => {}  })

interface Props {
  children: ReactNode
}

export const ImagesProvider = ({ children }: Props) => {
  const [imagesStore, setImagesStore] = useState<ImagesInterface | undefined>(undefined)

  return (
    <ImagesContext.Provider value={{ imagesStore, setImagesStore }}>
      {children}
    </ImagesContext.Provider>
  )
}
