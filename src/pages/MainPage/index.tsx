import { BlogsList } from 'src/pages/MainPage/components/BlogsList';
import { Header } from 'src/pages/MainPage/components/Header';

export const MainPage = (): JSX.Element => {
  return (
    <div className='d-flex flex-column'>
      <Header />
      <BlogsList />
    </div>
  );
};
