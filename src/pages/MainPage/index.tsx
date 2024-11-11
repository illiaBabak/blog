import { BlogsList } from 'src/components/BlogsList';
import { Header } from 'src/components/Header';

export const MainPage = (): JSX.Element => {
  return (
    <div className='d-flex flex-column'>
      <Header />
      <BlogsList />
    </div>
  );
};
