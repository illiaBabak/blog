import { JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeBtn } from 'src/components/ThemeBtn';
import { pageConfig } from 'src/config/pages';
import { useGetDeviceType } from 'src/hooks/useGetDeviceType';

export const StartPage = (): JSX.Element => {
  const navigate = useNavigate();

  const { isTablet, isMobile } = useGetDeviceType();

  return (
    <div className='start-page w-100 h-100 d-flex flex-column p-2'>
      <div
        className={`d-flex ${isTablet ? 'flex-column-reverse justify-content-center' : 'flex-row justify-content-around align-items-center'} w-100 h-100`}
      >
        <div
          className={`d-flex flex-column justify-content-center ${isMobile ? 'p-0 m-0' : 'ps-4 ms-4'} ${isTablet ? 'mb-auto align-items-center text-center' : 'align-items-start ps-4 ms-4'}`}
        >
          <h1 className='fw-bolder title'>Blog</h1>
          <p className={`${isMobile ? 'm-0 mt-4 p-2' : 'm-2 mt-4'} description`}>
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

        <div className={`d-flex flex-column justify-content-start w-100 ${isTablet ? 'mb-auto' : 'h-100'}`}>
          <ThemeBtn />
          {!isTablet && (
            <img className='object-fit-contain start-img w-100 h-75 m-auto' src='/start-img.png' alt='icon' />
          )}
        </div>
      </div>
    </div>
  );
};
