import { JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeBtn } from 'src/components/ThemeBtn';
import { pageConfig } from 'src/config/pages';

export const RedirectPage = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <div className='redirect-page d-flex flex-column w-100 h-100 p-2'>
      <ThemeBtn />
      <div className='m-auto align-self-center d-flex flex-column justify-content-center align-items-center text-center'>
        <h1>Oops, something went wrong :(</h1>
        <input
          className='btn text-white mt-3 p-2'
          type='submit'
          value='Return to start page'
          onClick={() => navigate(pageConfig.start)}
        />
      </div>
    </div>
  );
};
