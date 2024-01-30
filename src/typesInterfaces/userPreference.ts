export interface UserPreferenceInterface {
  userEmail: string;
  lightDarkMode: 'light' | 'dark';
}

export interface UserPreferenceInterfaceWithId extends UserPreferenceInterface {
  id: string;
}

export type UserPreferenceType = UserPreferenceInterfaceWithId | undefined;

export interface UserPreferenceProviderInterface {
  userPreferenceStore: UserPreferenceType;
  setUserPreferenceStore: (data: UserPreferenceType) => void;
}
