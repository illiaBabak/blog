import { JSX } from 'react';
import { BlogCard } from 'src/components/BlogCard';
import { Loader } from 'src/components/Loader';
import { Blog, BlogAction } from 'src/types/types';

type Props = {
  blogs: Blog[];
  isLoading: boolean;
  actionType: BlogAction;
};

export const BlogsList = ({ blogs, isLoading, actionType }: Props): JSX.Element => (
  <div className='w-100 scroll-container-y d-flex flex-row flex-wrap justify-content-between mt-4 rounded'>
    {isLoading ? (
      <Loader />
    ) : (
      blogs?.map((blog, index) => <BlogCard actionType={actionType} blog={blog} key={`blog-${blog.id}-${index}`} />)
    )}
  </div>
);
