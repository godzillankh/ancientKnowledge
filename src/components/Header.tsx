import React, { useContext, useState } from 'react';
import { auth, googleProvider } from '../firebaseConfig';
import { signInWithPopup, signOut } from 'firebase/auth';
import { Avatar, Button, FormControlLabel, styled, Switch } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { getReverseMode } from '../utils/themeStyles';
import { AuthContext } from '../hooks/authContext';
import { userPreferencesApiService } from '../api/userPreferencesApi';
import { UserPreferencesContext } from '../hooks/userPreferences';
import { ColorModeContext } from '../hooks/colorModeContext';

const Layout = styled('div')(({ theme }) => ({
  alignItems: 'center',
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  flex: 1,
  justifyContent: 'space-between',
  maxHeight: '35px',
  padding: '15px',
  textAlign: 'right',
}));

const UserWrapper = styled('div')(() => ({
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'right',
  textAlign: 'right',
}));

const UserNameDiv = styled('div')(({ theme }) => ({
  color: theme.palette.primary[getReverseMode(theme)],
  fontWeight: 'bold',
  margin: '0 10px',
}));


const LoginBtn = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `2px solid ${theme.palette.primary[getReverseMode(theme)]}`
}));

const LogoutBtn = styled(Button)(({ theme }) => ({
  color: theme.palette.error[getReverseMode(theme)],
  border: `2px solid ${theme.palette.error[getReverseMode(theme)]}`
}));

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff',
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
    width: 32,
    height: 32,
    '&:before': {
      content: '""',
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        '#fff',
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
    borderRadius: 20 / 2,
  },
}));

const Header = () => {

  const [colorModeNoUser, setColorModeNoUser] = useState<'dark' | 'light'>('light');

  const { user, setUser } = useContext(AuthContext);
  const { userPreferenceStore } = useContext(UserPreferencesContext);
  const { toggleColorMode } = useContext(ColorModeContext);

  const { addUserPreference, loading, updateUserPreference } = userPreferencesApiService();

  const theme = useTheme();

  const handleLogin = async () => {
    const data = await signInWithPopup(auth, googleProvider);
    const { user: { displayName, email, photoURL } } = data;
    setUser({ name: displayName, email, photo: photoURL });

  }

  const handleLogout = async () => {
    await signOut(auth);
    setUser(undefined);
  };

  const switchLightDarkMode = async (event: React.SyntheticEvent) => {
    const target = event.target as HTMLInputElement;

    // false / left side = light mode; true / right side = dark mode
    const nextMode = target.checked ? 'dark' : 'light';
    if (user && user?.email) {
      if (userPreferenceStore) await updateUserPreference({ ...userPreferenceStore, lightDarkMode: nextMode});
      else await addUserPreference({ userEmail: user.email, lightDarkMode: nextMode});
    } else {
      setColorModeNoUser(nextMode)
    }
    toggleColorMode();
  }

  return (
    <Layout theme={theme}>
      <FormControlLabel
        checked={(userPreferenceStore?.lightDarkMode || colorModeNoUser) === 'dark'}
        control={<MaterialUISwitch sx={{ m: 1 }}  />}
        disabled={loading}
        label=""
        onChange={switchLightDarkMode}
      />
      <UserWrapper>
        {user && (
          <UserWrapper>
            <Avatar  src={user.photo || ''} />
            <UserNameDiv theme={theme}>{user.name}</UserNameDiv>
          </UserWrapper>
        )}
        {user ? <LogoutBtn onClick={handleLogout}>logout</LogoutBtn> : <LoginBtn onClick={handleLogin}>Login</LoginBtn>}
      </UserWrapper>
    </Layout>);
}

export default Header;
