import { JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeBtn } from 'src/components/ThemeBtn';
import { pageConfig } from 'src/config/pages';

export const StartPage = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <div className='start-page w-100 h-100 d-flex flex-column p-2'>
      <div className='d-flex justify-content-around align-items-center flex-row w-100 h-100'>
        <div className='d-flex flex-column justify-content-center align-items-start ps-4 ms-4 mb-4'>
          <h1 className='fw-bolder title'>Blog</h1>
          <p className='m-2 mt-4 description'>
            Share your thoughts, connect with others, and discover fresh ideas in a vibrant community. Post updates,
            write blogs, and join conversations on topics that inspire you. Your voice matters—start sharing today!
          </p>
          <input
            className='m-2 mt-4 btn text-white fs-5'
            type='submit'
            value='Start'
            onClick={() => navigate(pageConfig.login)}
          />
        </div>

        <div className='d-flex flex-column justify-content-start w-100 h-100'>
          <ThemeBtn />
          <img className='object-fit-contain w-100 h-75 m-auto' src='/start-img.png' alt='icon' />
        </div>
      </div>
    </div>
  );
};
