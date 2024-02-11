import React from 'react';
import { AuthProvider } from './hooks/authContext';
import { UserPreferenceProvider } from './hooks/userPreferences';
import { DataProvider } from './hooks/dataContext';
import App from './App';
import { ColorModeProvider } from './hooks/colorModeContext';
import { ScreensProvider } from './hooks/screensContext';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ImagesProvider } from './hooks/imagesContext';

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
                <ImagesProvider>
                  <RouterProvider router={router} />
                </ImagesProvider>
              </ScreensProvider>
            </DataProvider>
          </ColorModeProvider>
        </UserPreferenceProvider>
      </AuthProvider>
  );
}

export default AppWrapper;
