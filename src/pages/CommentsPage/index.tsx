import { JSX, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useBlogImageQuery, useGetBlogByIdQuery } from 'src/api/blogs';
import { useAddComment, useGetCommentsQuery } from 'src/api/comments';
import {
  useGetUserByIdQuery,
  useGetCurrentUserImageQuery,
  useGetCurrentUserQuery,
} from 'src/api/user';
import { Loader } from 'src/components/Loader';
import { SkeletonLoader } from 'src/components/SkeletonLoader';
import { ThemeBtn } from 'src/components/ThemeBtn';
import { pageConfig } from 'src/config/pages';
import { formatDate } from 'src/utils/formatDate';
import { Comment } from './components/Comment';
import { useGetDeviceType } from 'src/hooks/useGetDeviceType';

export const CommentsPage = (): JSX.Element => {
  const navigate = useNavigate();

  const { isMobile } = useGetDeviceType();

  const [searchParams] = useSearchParams();

  const [comment, setComment] = useState('');

  const blogId = Number(searchParams.get('blog-id')) ?? 0;

  const { data: blog, isLoading: isLoadingBlog } = useGetBlogByIdQuery(blogId);

  const { data: blogImg, isLoading: isLoadingBlogImg } =
    useBlogImageQuery(blogId);

  const { data: user, isLoading: isLoadingUser } = useGetUserByIdQuery(
    blog?.user_id as string,
    {
      enabled: !!blog?.user_id,
    }
  );

  const { data: userImg, isLoading: isLoadingUserImg } =
    useGetCurrentUserImageQuery(user?.user_id as string, {
      enabled: !!user?.user_id,
    });

  const { data: currentUser, isLoading: isLoadingCurrentUser } =
    useGetCurrentUserQuery();

  const { data: currentUserImg, isLoading: isLoadingCurrentUserImg } =
    useGetCurrentUserImageQuery(currentUser?.id ?? '', {
      enabled: !!currentUser?.id,
    });

  const { data: comments, isLoading: isLoadingComments } =
    useGetCommentsQuery(blogId);

  const { mutateAsync: createComment } = useAddComment();

  const handleAddComment = () => {
    if (!comment || !currentUser?.id) return;

    createComment({ comment, userId: currentUser.id, blogId });
    setComment('');
  };

  return (
    <div className='d-flex flex-column h-100 position-relative comments-page'>
      <div
        className={`d-flex ${isMobile ? 'flex-column-reverse' : 'flex-row'} position-absolute align-items-center btns-container`}
      >
        <div
          onClick={() => navigate(pageConfig.main)}
          className='btn d-flex text-white align-items-center justify-content-center p-2 m-2 mx-3'
        >
          &lt; Back
        </div>
        <ThemeBtn />
      </div>
      <div className='d-flex blog-content p-3'>
        {isLoadingBlogImg || isLoadingBlog ? (
          <SkeletonLoader />
        ) : (
          <img
            className='object-fit-cover blog-img rounded'
            src={blogImg ?? '/not-found.jpg'}
            alt='blog-img'
          />
        )}
        <div className='d-flex flex-column ms-3 w-100 h-100 justify-content-between'>
          <div className='d-flex flex-column info w-100'>
            {isLoadingBlog ? (
              <SkeletonLoader />
            ) : (
              <h3 className='title'>{blog?.title}</h3>
            )}
            {isLoadingBlog ? (
              <SkeletonLoader />
            ) : (
              <p className='mt-2 w-75 scroll-container-y description'>
                {blog?.description}
              </p>
            )}
          </div>

          <div className='d-flex flex-row align-items-center detailed-info'>
            <div
              className='d-flex flex-row user-info align-items-center'
              onClick={() =>
                navigate(`${pageConfig.profile}?userId=${user?.user_id}`)
              }
            >
              {isLoadingUserImg || isLoadingUser || !userImg ? (
                <SkeletonLoader />
              ) : (
                <img
                  className='object-fit-cover rounded-circle user-icon'
                  src={userImg}
                  alt='user-img'
                  onError={({ currentTarget }) => {
                    currentTarget.src = '/empty-pfp.png';
                    currentTarget.onerror = null; //stop looping
                  }}
                />
              )}

              {isLoadingUser || !user?.username ? (
                <SkeletonLoader />
              ) : (
                <p className='mb-0 ms-2 username'>{user?.username}</p>
              )}
            </div>

            {isLoadingBlog || !blog?.created_at ? (
              <SkeletonLoader />
            ) : (
              <p className='date mb-0 ms-4'>{formatDate(blog.created_at)}</p>
            )}
          </div>
        </div>
      </div>

      <div className='d-flex flex-column comments h-100'>
        <div className='d-flex flex-row mt-2 p-3 pt-4 comment-form align-items-center'>
          {isLoadingCurrentUserImg || isLoadingCurrentUser ? (
            <SkeletonLoader />
          ) : (
            <img
              className='object-fit-cover rounded-circle user-img'
              src={currentUserImg ?? '/empty-pfp.png'}
              alt='user-img'
            />
          )}

          <input
            value={comment}
            onChange={({ currentTarget: { value } }) => setComment(value)}
            className='mx-2 comment-input rounded p-2'
            type='text'
            placeholder='Write your comment'
          />
          <div
            onClick={handleAddComment}
            className='btn ms-2 text-white d-flex justify-content-center align-items-center'
          >
            Post
          </div>
        </div>

        <div className='d-flex flex-column comments-container mt-2 scroll-container-y'>
          {isLoadingComments ? (
            <Loader />
          ) : (
            comments?.map((comment, index) => (
              <Comment
                blogId={blogId}
                comment={comment}
                key={`comment-${index}-${comment.id}`}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
