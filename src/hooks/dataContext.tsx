import { createContext, type ReactNode, useState } from 'react'
import { DataItemInterfaceWithId } from '../typesInterfaces/dataItem';

interface DataProvider {
  dataStore: DataItemInterfaceWithId[] | undefined;
  setDataStore: (data: DataItemInterfaceWithId[] | undefined) => void;
}

export const DataContext = createContext<DataProvider>({ dataStore: undefined, setDataStore: () => {}  })

interface Props {
  children: ReactNode
}

export const DataProvider = ({ children }: Props) => {
  const [dataStore, setDataStore] = useState<DataItemInterfaceWithId[] | undefined>(undefined)

  return (
    <DataContext.Provider value={{ dataStore, setDataStore }}>
      {children}
    </DataContext.Provider>
  )
}
