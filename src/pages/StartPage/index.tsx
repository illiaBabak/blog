import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { pageConfig } from 'src/config/pages';
import { GlobalContext } from 'src/root';

export const StartPage = (): JSX.Element => {
  const { isLightTheme } = useContext(GlobalContext);
  const navigate = useNavigate();

  return (
    <div className='start-page w-100 h-100 d-flex flex-column justify-content-center align-items-center'>
      <h1 className={`fw-bolder title ${isLightTheme ? 'text-dark' : 'text-white'}`}>Blog</h1>
      <p className={`m-2 ${isLightTheme ? 'text-dark' : 'text-white'}`}>
        To use our service you need to login with your account!
      </p>
      <input className='m-2 btn text-white' type='submit' value='Login' onClick={() => navigate(pageConfig.login)} />
    </div>
  );
};
