import { JSX, useEffect, useState } from 'react';
import { useBlogImageQuery, useEditBlog, useGetUserBlogsQuery } from 'src/api/blogs';
import { BlogsList } from 'src/components/BlogsList';
import { FormField } from 'src/components/FormField';
import { WindowWrapper } from 'src/components/WindowWrapper';
import { useGetDeviceType } from 'src/hooks/useGetDeviceType';
import { Blog } from 'src/types/types';
import { SUPABASE_URL } from 'src/utils/constants';

type Props = {
  onClose: () => void;
  userId: string;
};

export const EditBlogWindow = ({ onClose, userId }: Props): JSX.Element => {
  const [blogToEdit, setBlogToEdit] = useState<Blog | null>(null);

  const [editedBlogImg, setEditedBlogImg] = useState<File | null>(null);
  const [editedTitle, seteditedTitle] = useState('');
  const [editedDescription, seteditedDescription] = useState('');

  const { data: userBlogs, isLoading: isLoadingUserBlogs } = useGetUserBlogsQuery(userId);

  const { data: blogImg } = useBlogImageQuery(blogToEdit?.id ?? 0, { enabled: !!blogToEdit?.id });

  const { mutateAsync: editBlog } = useEditBlog();

  const { isMobile } = useGetDeviceType();

  const handleEditBlog = () => {
    if (!blogToEdit) return;

    const editedBlog: Blog = {
      id: blogToEdit?.id ?? 0,
      created_at: blogToEdit?.created_at ?? '',
      title: editedTitle,
      description: editedDescription,
      user_id: blogToEdit?.user_id ?? '',
      image_url: editedBlogImg
        ? `${SUPABASE_URL}/storage/v1/object/public/images/blogs/${blogToEdit.id}?t=${Date.now()}`
        : blogToEdit.image_url,
    };

    editBlog({ blog: editedBlog, newImg: editedBlogImg });
    onClose();
  };

  useEffect(() => {
    seteditedTitle(blogToEdit?.title ?? '');
    seteditedDescription(blogToEdit?.description ?? '');
  }, [blogToEdit, seteditedTitle, seteditedDescription]);

  return (
    <WindowWrapper onClose={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className='edit-blog-window position-relative d-flex flex-column align-items-center rounded p-2'
      >
        {isMobile ? (
          <h6 className='mt-3'>{blogToEdit ? 'Edit blog' : 'Choose blog to edit'}</h6>
        ) : (
          <h2 className='mt-3'>{blogToEdit ? 'Edit blog' : 'Choose blog to edit'}</h2>
        )}

        <div onClick={onClose} className='close-btn d-flex justify-content-center align-items-center position-absolute'>
          x
        </div>
        {blogToEdit ? (
          <div
            className={`d-flex flex-column justify-content-center align-items-center ${isMobile ? 'w-100' : 'w-75'}`}
          >
            <div className='position-relative d-flex img-wrapper mt-4'>
              <img
                className='blog-img w-100 object-fit-cover'
                src={editedBlogImg ? URL.createObjectURL(editedBlogImg) : (blogImg ?? '/not-found.jpg')}
                alt='blog-img'
              />
              <input
                type='file'
                className='file-input position-absolute w-100'
                onChange={({ currentTarget: { files } }) => {
                  if (!files) return;

                  const image = files[0];

                  setEditedBlogImg(image);
                }}
              />
            </div>

            <div className='d-flex flex-column align-items-center w-75 py-2'>
              <FormField
                type='text'
                fieldName='Title'
                inputVal={editedTitle}
                onChange={({ currentTarget: { value } }) => seteditedTitle(value)}
              />
              <FormField
                type='text'
                fieldName='Description'
                inputVal={editedDescription}
                onChange={({ currentTarget: { value } }) => seteditedDescription(value)}
              />
            </div>

            <div
              className='edit-btn text-center d-flex justify-content-center align-items-center rounded p-2 text-white mt-4'
              onClick={handleEditBlog}
            >
              Save
            </div>
          </div>
        ) : (
          <div className='d-flex flex-row w-100 h-100 scroll-container-y'>
            {!isLoadingUserBlogs && !userBlogs?.length && (
              <div className='d-flex w-100 h-100 flex-column justify-content-center align-items-center mb-4'>
                <p className='fs-2 mb-4'>No blogs found :(</p>
              </div>
            )}
            {(isLoadingUserBlogs || !!userBlogs?.length) && (
              <BlogsList
                actionType={{ type: 'edit', blogToEdit, setBlogToEdit }}
                blogs={userBlogs as Blog[]}
                isLoading={isLoadingUserBlogs}
              />
            )}
          </div>
        )}
      </div>
    </WindowWrapper>
  );
};
