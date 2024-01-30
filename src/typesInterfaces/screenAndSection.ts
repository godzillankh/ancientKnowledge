type FlexDirectionType = 'row' | 'column';

interface SectionInterface {
  flex: number;
  name: string;
  tags: string[];
}

interface RowColumnInterface {
  flex: number;
  flexDirection: FlexDirectionType;
  name: string;
  rowsColumns: SectionInterface[]
}

export interface ScreenInterface {
  flexDirection: FlexDirectionType;
  name: string;
  rowsColumns: RowColumnInterface[];
  userEmail?: string;
}

export interface ScreenInterfaceWithId extends ScreenInterface {
  id: string;
}


// Context

export type ScreensType = ScreenInterfaceWithId[] | undefined;

export interface ScreensProviderInterface {
  screensStore: ScreensType;
  setScreensStore: (data: ScreenInterfaceWithId[] | undefined) => void;
}
