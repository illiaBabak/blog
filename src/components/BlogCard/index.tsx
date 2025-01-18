import { JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBlogImageQuery } from 'src/api/blogs';
import { useGetCurrentUserImageQuery, useGetUserByIdQuery } from 'src/api/user';
import { SkeletonLoader } from 'src/components/SkeletonLoader';
import { pageConfig } from 'src/config/pages';
import { Blog, BlogAction } from 'src/types/types';
import { formatDate } from 'src/utils/formatDate';

type Props = {
  blog: Blog;
  actionType: BlogAction;
};

export const BlogCard = ({ blog, actionType }: Props): JSX.Element => {
  const navigate = useNavigate();

  const { data: url, isLoading: isLoadingImg } = useBlogImageQuery(blog.id, {
    enabled: !!blog.id,
  });

  const { data: user } = useGetUserByIdQuery(blog.user_id as string, { enabled: !!blog.user_id });

  const { data: userImg } = useGetCurrentUserImageQuery(user?.user_id as string, { enabled: !!user?.user_id });

  const handleClickBlog = () => {
    if (!actionType) return;

    if (actionType.type === 'delete') {
      const isBlogToDelete = actionType.blogsToDelete.includes(blog.id);

      if (isBlogToDelete) actionType.setBlogsToDelete((prev) => prev.filter((prevId) => prevId !== blog.id));
      else actionType.setBlogsToDelete((prev) => [blog.id, ...prev]);
    } else if (actionType.type === 'edit') {
      actionType.setBlogToEdit(blog);
    }
  };

  return (
    <div
      onClick={handleClickBlog}
      className={`blog ${actionType?.type === 'edit' || actionType?.type === 'delete' ? `${actionType.type}-blog` : ''} ${actionType?.type === 'delete' && actionType.blogsToDelete.includes(blog.id) ? 'selected' : ''} rounded mt-0 mb-4 mx-3`}
    >
      {isLoadingImg ? (
        <SkeletonLoader />
      ) : (
        <img src={url ? url : '/not-found.jpg'} alt='blog image' className='blog-img w-100 object-fit-cover' />
      )}

      <div className='px-3 py-2'>
        <p className='date m-0'>{formatDate(blog.created_at)}</p>
        <h3 className='title my-2'>{blog.title}</h3>
        <p className='description m-0 scroll-container-y'>{blog.description}</p>
        {user && (
          <div
            className='d-flex flex-row user-info'
            onClick={() => navigate(`${pageConfig.profile}?userId=${user.user_id}`)}
          >
            <img
              className='object-fit-cover rounded-circle user-icon'
              src={userImg ?? '/empty-pfp.png'}
              alt='user-img'
              onError={(e) => {
                e.currentTarget.src = '/empty-pfp.png';
                e.currentTarget.onerror = null;
              }}
            />
            <p className='mb-0 ms-2 d-flex align-items-center'>{user?.username}</p>
          </div>
        )}
      </div>
    </div>
  );
};
