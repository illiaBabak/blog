import { createContext, useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { pageConfig } from 'src/config/pages';
import { Confirm } from 'src/pages/ConfirmPage';
import { LoginPage } from 'src/pages/LoginPage';
import { MainPage } from 'src/pages/MainPage';
import { ProfilePage } from 'src/pages/ProfilePage';
import { RedirectPage } from 'src/pages/RedirectPage';
import { StartPage } from 'src/pages/StartPage';

type GlobalContextType = {
  isLightTheme: boolean;
  setIsLightTheme: React.Dispatch<React.SetStateAction<boolean>>;
};

export const GlobalContext = createContext<GlobalContextType>({
  isLightTheme: true,
  setIsLightTheme: () => {
    throw new Error('Global context is not initialized');
  },
});

export const App = (): JSX.Element => {
  const [isLightTheme, setIsLightTheme] = useState(() => {
    const storedData = localStorage.getItem('is_light_theme');

    return storedData ? JSON.parse(storedData) === 'light' : true;
  });

  useEffect(() => {
    const { body } = document;

    body.style.setProperty('--main', isLightTheme ? '#ebebee' : '#292831');
    body.style.setProperty('--second-color', isLightTheme ? '#a9a8a8' : '#8f9094');
    body.style.setProperty('--accent', isLightTheme ? '#5633af' : '#8e55cc');
    body.style.setProperty('--primary-color', isLightTheme ? '#fff' : '#333642');
    body.style.setProperty('--start-page', isLightTheme ? '#fff' : '#292831');

    localStorage.setItem('is_light_theme', JSON.stringify(isLightTheme ? 'light' : 'dark'));
  }, [isLightTheme]);

  const { start, login, redirect, main, confirm, profile } = pageConfig;

  return (
    <div className='main-container m-0 p-0'>
      <GlobalContext.Provider value={{ isLightTheme, setIsLightTheme }}>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Navigate to={start} />} />
            <Route path='/*' element={<Navigate to={redirect} />} />
            <Route path={start} element={<StartPage />} />
            <Route path={login} element={<LoginPage />} />
            <Route path={redirect} element={<RedirectPage />} />
            <Route path={main} element={<MainPage />} />
            <Route path={confirm} element={<Confirm />} />
            <Route path={profile} element={<ProfilePage />} />
          </Routes>
        </BrowserRouter>
      </GlobalContext.Provider>
    </div>
  );
};
