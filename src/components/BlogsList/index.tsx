import { BlogCard } from 'src/components/BlogCard';
import { Loader } from 'src/components/Loader';
import { Blog } from 'src/types/types';

type Props = {
  blogs: Blog[];
  isLoading: boolean;
};

export const BlogsList = ({ blogs, isLoading }: Props): JSX.Element => (
  <div className='w-100 scroll-container-y d-flex flex-row flex-wrap justify-content-between mt-4 rounded'>
    {isLoading ? <Loader /> : blogs?.map((blog, index) => <BlogCard blog={blog} key={`blog-${blog.id}-${index}`} />)}
  </div>
);
