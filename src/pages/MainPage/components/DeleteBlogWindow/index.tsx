import { JSX, useState } from 'react';
import { useDeleteUserBlogs, useGetUserBlogsQuery } from 'src/api/blogs';
import { BlogsList } from 'src/components/BlogsList';
import { WindowWrapper } from 'src/components/WindowWrapper';
import { Blog } from 'src/types/types';

type Props = {
  onClose: () => void;
  userId: string;
};

export const DeleteBlogWindow = ({ onClose, userId }: Props): JSX.Element => {
  const { data: userBlogs, isLoading: isLoadingUserBlogs } = useGetUserBlogsQuery(userId);

  const { mutateAsync: deleteBlogs } = useDeleteUserBlogs();

  const [blogsToDelete, setBlogsToDelete] = useState<number[]>([]); // ids to delete

  const handleDeleteBlogs = () => {
    if (blogsToDelete.length) {
      deleteBlogs({ ids: blogsToDelete });

      setBlogsToDelete([]);
    }

    onClose();
  };

  return (
    <WindowWrapper onClose={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className='delete-blog-window d-flex justify-content-center align-items-center rounded position-relative'
      >
        <h2 className='mt-3'>Choose blogs to delete</h2>
        <div onClick={onClose} className='position-absolute d-flex justify-content close-btn'>
          x
        </div>
        <div className='d-flex flex-row w-100 h-100 scroll-container-y'>
          {!isLoadingUserBlogs && !userBlogs?.length && (
            <div className='d-flex w-100 h-100 flex-column justify-content-center align-items-center mb-4'>
              <p className='fs-2 mb-4'>No blogs found :(</p>
            </div>
          )}
          {(isLoadingUserBlogs || !!userBlogs?.length) && (
            <BlogsList
              actionType={{ type: 'delete', blogsToDelete, setBlogsToDelete }}
              blogs={userBlogs as Blog[]}
              isLoading={isLoadingUserBlogs}
            />
          )}
        </div>

        <div
          className='delete-btn text-white d-flex justify-content-center align-items-center rounded mb-3'
          onClick={handleDeleteBlogs}
        >
          Delete
        </div>
      </div>
    </WindowWrapper>
  );
};
