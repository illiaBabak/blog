import { useNavigate } from 'react-router-dom';
import { pageConfig } from 'src/config/pages';

export const StartPage = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <div className='start-page w-100 h-100 d-flex justify-content-center align-items-center'>
      <h2 className='fw-bolder'>Blog</h2>
      <p>To use our service you need login with your account</p>
      <input type='submit' value='Login' onClick={() => navigate(pageConfig.login)} />
    </div>
  );
};
