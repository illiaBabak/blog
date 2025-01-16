import { BlogsList } from 'src/components/BlogsList';
import { Header } from 'src/pages/MainPage/components/Header';
import { UserInfo } from './components/UserInfo';
import { UserOperations } from './components/UserOperations';
import { createContext, JSX, useState } from 'react';
import { CreateBlogWindow } from './components/CreateBlogWindow';
import { useBlogsQuery } from 'src/api/blogs';

type MainPageContextType = {
  setShouldShowCreateWindow: React.Dispatch<React.SetStateAction<boolean>>;
};

export const MainPageContext = createContext<MainPageContextType>({
  setShouldShowCreateWindow: () => {
    throw new Error('MainPageContext is not initalized!');
  },
});

export const MainPage = (): JSX.Element => {
  const [shouldShowCreateWindow, setShouldShowCreateWindow] = useState(false);

  const { data: blogs, isLoading: isLoadingBlogs } = useBlogsQuery();

  return (
    <MainPageContext.Provider value={{ setShouldShowCreateWindow }}>
      <div className='d-flex flex-column main-page'>
        <Header />
        <div className='d-flex flex-row px-4 content'>
          <div className='d-flex flex-column mt-4'>
            <UserInfo />
            <UserOperations />
          </div>
          {isLoadingBlogs || (blogs && <BlogsList isLoading={isLoadingBlogs} blogs={blogs} />)}
        </div>

        {shouldShowCreateWindow && <CreateBlogWindow />}
      </div>
    </MainPageContext.Provider>
  );
};
