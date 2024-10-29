import { createClient } from '@supabase/supabase-js';
import { createContext, useEffect, useState } from 'react';
import { BlogsList } from 'src/components/BlogsList';
import { Header } from 'src/components/Header';
import { Database } from 'src/types/supabase';
import { SUPABASE_URL } from 'src/utils/constants';

export const supabase = createClient<Database>(SUPABASE_URL, import.meta.env.ENV_API_KEY);

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

    body.style.setProperty('--primary-color', isLightTheme ? '#ededed' : '#292831');
    body.style.setProperty('--second-color', isLightTheme ? '#a9a8a8' : '#8f9094');
    body.style.setProperty('--accent', isLightTheme ? '#5633af' : '#8e55cc');
    body.style.setProperty('--main', isLightTheme ? '#c8c7c7' : '#333642');

    localStorage.setItem('is_light_theme', JSON.stringify(isLightTheme ? 'light' : 'dark'));
  }, [isLightTheme]);

  return (
    <GlobalContext.Provider value={{ isLightTheme, setIsLightTheme }}>
      <div className='d-flex flex-column'>
        <Header />
        <BlogsList />
      </div>
    </GlobalContext.Provider>
  );
};
