import React from 'react';
import { AuthProvider } from './hooks/authContext';
import { UserPreferenceProvider } from './hooks/userPreferences';
import { DataProvider } from './hooks/dataContext';
import App from './App';
import { ColorModeProvider } from './hooks/colorModeContext';
import { ScreensProvider } from './hooks/screensContext';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

function AppWrapper() {

  const router = createBrowserRouter([
    {
      path: '/',
      element: <App />,
    },
  ]);

  return (
      <AuthProvider>
        <UserPreferenceProvider>
          <ColorModeProvider>
            <DataProvider>
              <ScreensProvider>
                <RouterProvider router={router} />
              </ScreensProvider>
            </DataProvider>
          </ColorModeProvider>
        </UserPreferenceProvider>
      </AuthProvider>
  );
}

export default AppWrapper;
