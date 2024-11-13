import { useBlogsQuery } from 'src/api/blogs';
import { BlogCard } from '../BlogCard';
import { Loader } from '../../../../components/Loader';

export const BlogsList = (): JSX.Element => {
  const { data: blogs, isLoading } = useBlogsQuery();

  return (
    <div className='w-100 d-flex flex-row flex-wrap justify-content-between'>
      {isLoading ? <Loader /> : blogs?.map((blog, index) => <BlogCard blog={blog} key={`blog-${blog.id}-${index}`} />)}
    </div>
  );
};
