import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { pageConfig } from 'src/config/pages';
import { BlogsList } from 'src/pages/MainPage/components/BlogsList';
import { Header } from 'src/pages/MainPage/components/Header';
import { GlobalContext } from 'src/root';

interface AuthMessage {
  type: 'VERIFIED'; // или другие типы сообщений, если они есть
}

export const MainPage = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <div className='d-flex flex-column'>
      <Header />
      <BlogsList />
    </div>
  );
};
