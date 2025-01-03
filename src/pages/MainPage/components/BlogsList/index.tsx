import { useBlogsQuery } from 'src/api/blogs';
import { BlogCard } from '../BlogCard';
import { Loader } from 'src/components/Loader';

export const BlogsList = (): JSX.Element => {
  const { data: blogs, isLoading } = useBlogsQuery();

  return (
    <div className='w-100 scroll-container-y d-flex flex-row flex-wrap justify-content-between mt-4'>
      {isLoading ? <Loader /> : blogs?.map((blog, index) => <BlogCard blog={blog} key={`blog-${blog.id}-${index}`} />)}
    </div>
  );
};
