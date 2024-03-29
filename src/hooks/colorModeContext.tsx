import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { UserPreferencesContext } from './userPreferences';

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

interface Props {
  children: ReactNode
}

export const ColorModeProvider = ({ children }: Props) => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const { userPreferenceStore } = useContext(UserPreferencesContext);

  // Update color according to the user preferences
  useEffect(() => {
    if ((!userPreferenceStore?.lightDarkMode && mode === 'dark') || (userPreferenceStore?.lightDarkMode !== mode)) {
      setMode(userPreferenceStore?.lightDarkMode || 'light'); // light by default
    }
  }, [userPreferenceStore]);


  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}
