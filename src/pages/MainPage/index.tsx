import { BlogsList } from 'src/pages/MainPage/components/BlogsList';
import { Header } from 'src/pages/MainPage/components/Header';
import { UserInfo } from './components/UserInfo';
import { UserOperations } from './components/UserOperations';

export const MainPage = (): JSX.Element => {
  return (
    <div className='d-flex flex-column main-page'>
      <Header />
      <div className='d-flex flex-row px-4 content'>
        <div className='d-flex flex-column mt-4'>
          <UserInfo />
          <UserOperations />
        </div>
        <BlogsList />
      </div>
    </div>
  );
};
