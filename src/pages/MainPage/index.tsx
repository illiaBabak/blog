import { BlogsList } from 'src/components/BlogsList';
import { Header } from 'src/pages/MainPage/components/Header';
import { UserInfo } from './components/UserInfo';
import { UserOperations } from './components/UserOperations';
import { JSX, useState } from 'react';
import { CreateBlogWindow } from './components/CreateBlogWindow';
import { useBlogsQuery, useGetSearchBlogsQuery } from 'src/api/blogs';
import { DeleteBlogWindow } from './components/DeleteBlogWindow';
import { useGetCurrentUserQuery } from 'src/api/user';
import { useSearchParams } from 'react-router-dom';
import { EditBlogWindow } from './components/EditBlogWindow';
import { useGetDeviceType } from 'src/hooks/useGetDeviceType';

export const MainPage = (): JSX.Element => {
  const [shouldShowCreateWindow, setShouldShowCreateWindow] = useState(false);
  const [shouldShowDeleteWindow, setShouldShowDeleteWindow] = useState(false);
  const [shouldShowEditWindow, setShouldShowEditWindow] = useState(false);

  const [searchParams] = useSearchParams();

  const searchedText = searchParams.get('query') ?? '';

  const { data: blogs, isLoading: isLoadingBlogs } = useBlogsQuery();

  const { data: user, isLoading: isLoadingUser } = useGetCurrentUserQuery();

  const { data: searchedBlogs, isLoading: isLoadingSearchedBlogs } = useGetSearchBlogsQuery(searchedText, {
    enabled: !!searchedText,
  });

  const { isMobile } = useGetDeviceType();

  return (
    <div className='d-flex flex-column main-page'>
      <Header />
      <div className={`d-flex ${isMobile ? 'flex-column' : 'flex-row'} px-4 content`}>
        <div className='mt-4'>
          <UserInfo user={user} isLoadingUser={isLoadingUser} />
          <UserOperations
            showCreateWindow={() => setShouldShowCreateWindow(true)}
            showDeleteWindow={() => setShouldShowDeleteWindow(true)}
            showEditWindow={() => setShouldShowEditWindow(true)}
          />
        </div>
        {isLoadingSearchedBlogs ||
          (!!searchedBlogs?.length && (
            <BlogsList actionType={{ type: 'comments' }} isLoading={isLoadingSearchedBlogs} blogs={searchedBlogs} />
          ))}

        {!searchedBlogs?.length &&
          !isLoadingSearchedBlogs &&
          (isLoadingBlogs ||
            (blogs && <BlogsList actionType={{ type: 'comments' }} isLoading={isLoadingBlogs} blogs={blogs} />))}
      </div>

      {shouldShowCreateWindow && <CreateBlogWindow onClose={() => setShouldShowCreateWindow(false)} />}
      {shouldShowDeleteWindow && (
        <DeleteBlogWindow onClose={() => setShouldShowDeleteWindow(false)} userId={user?.id ?? ''} />
      )}
      {shouldShowEditWindow && (
        <EditBlogWindow onClose={() => setShouldShowEditWindow(false)} userId={user?.id ?? ''} />
      )}
    </div>
  );
};
