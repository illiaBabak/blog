import { BlogsList } from 'src/components/BlogsList';
import { Header } from 'src/pages/MainPage/components/Header';
import { UserInfo } from './components/UserInfo';
import { UserOperations } from './components/UserOperations';
import { JSX, useState } from 'react';
import { CreateBlogWindow } from './components/CreateBlogWindow';
import { useBlogsQuery } from 'src/api/blogs';
import { DeleteBlogWindow } from './components/DeleteBlogWindow';
import { useGetCurrentUserQuery } from 'src/api/user';

export const MainPage = (): JSX.Element => {
  const [shouldShowCreateWindow, setShouldShowCreateWindow] = useState(false);
  const [shouldShowDeleteWindow, setShouldShowDeleteWindow] = useState(false);

  const { data: blogs, isLoading: isLoadingBlogs } = useBlogsQuery();

  const { data: user, isLoading: isLoadingUser } = useGetCurrentUserQuery();

  return (
    <div className='d-flex flex-column main-page'>
      <Header />
      <div className='d-flex flex-row px-4 content'>
        <div className='d-flex flex-column mt-4'>
          <UserInfo user={user} isLoadingUser={isLoadingUser} />
          <UserOperations
            showCreateWindow={() => setShouldShowCreateWindow(true)}
            showDeleteWindow={() => setShouldShowDeleteWindow(true)}
          />
        </div>
        {isLoadingBlogs || (blogs && <BlogsList actionType={null} isLoading={isLoadingBlogs} blogs={blogs} />)}
      </div>

      {shouldShowCreateWindow && <CreateBlogWindow onClose={() => setShouldShowCreateWindow(false)} />}
      {shouldShowDeleteWindow && (
        <DeleteBlogWindow onClose={() => setShouldShowDeleteWindow(false)} userId={user?.id ?? ''} />
      )}
    </div>
  );
};
