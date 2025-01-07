import { useBlogImageQuery } from 'src/api/blogs';
import { useGetUserImageQuery, useUserByIdQuery } from 'src/api/user';
import { SkeletonLoader } from 'src/components/SkeletonLoader';
import { Blog } from 'src/types/types';
import { formatDate } from 'src/utils/formatDate';

type Props = {
  blog: Blog;
};

export const BlogCard = ({ blog }: Props): JSX.Element => {
  const { data: url, isLoading: isLoadingImg } = useBlogImageQuery(blog.image_url);

  const { data: user } = useUserByIdQuery(blog.user_id ?? '', { enabled: !!blog.user_id });

  const { data: userImg } = useGetUserImageQuery(user?.email?.split('@')[0] ?? '');

  return (
    <div className='blog rounded mt-0 mb-4 mx-3'>
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
          <div className='d-flex flex-row'>
            <img className='object-fit-contain rounded-circle user-icon' src={userImg} alt='user-img' />
            <p className='mb-0 ms-2'>{user?.username}</p>
          </div>
        )}
      </div>
    </div>
  );
};
