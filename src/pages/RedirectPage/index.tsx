import { useNavigate } from 'react-router-dom';
import { pageConfig } from 'src/config/pages';

export const RedirectPage = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <div className='redirect-page d-flex flex-column justify-content-center align-items-center w-100 h-100'>
      <h1>Oops, something went wrong :(</h1>
      <input
        className='btn text-white mt-3 p-2'
        type='submit'
        value='Return to start page'
        onClick={() => navigate(pageConfig.start)}
      />
    </div>
  );
};
