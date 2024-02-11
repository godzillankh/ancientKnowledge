export interface ImagesItemInterface {
  dataImage: string;
  userEmail: string;
}

export interface ImagesInterface {
  [id: string]: string;
}

export type ImagesType = ImagesInterface | undefined;

export interface ImagesProviderInterface {
  userPreferenceStore: ImagesType;
  setUserPreferenceStore: (data: ImagesType) => void;
}
