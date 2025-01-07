import { useContext, useState } from 'react';
import { MainPageContext } from '../..';
import { FormField } from 'src/components/FormField';
import { useCreateBlog } from 'src/api/blogs';
import { generateKey } from 'src/utils/generateKey';

export const CreateBlogWindow = (): JSX.Element => {
  const { setShouldShowCreateWindow } = useContext(MainPageContext);

  const [blogImg, setBlogImg] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const { mutateAsync: createBlog } = useCreateBlog();
  const hideWindow = () => setShouldShowCreateWindow(false);

  const createBlogHandle = () => {
    const imageKey = generateKey(16);

    createBlog({ title, description, image: blogImg, imageKey });
    hideWindow();
  };

  const shouldCreate = !!title.length && !!description.length;

  return (
    <div
      className='wrapper position-absolute d-flex justify-content-center align-items-center overflow-hidden'
      onClick={hideWindow}
    >
      <div
        className='window text-center d-flex flex-column align-items-center rounded position-relative'
        onClick={(e) => e.stopPropagation()}
      >
        <h4 className='m-0 mt-3'>Create your own blog!</h4>
        <div
          className='hide-btn position-absolute m-0 me-1 mt-1 d-flex justify-content-center align-items-center'
          onClick={hideWindow}
        >
          x
        </div>

        <div className='position-relative d-flex img-wrapper mt-4'>
          <img
            className='blog-img w-100 object-fit-contain'
            src={blogImg ? URL.createObjectURL(blogImg) : '/not-found.jpg'}
            alt='blog-img'
          />
          <input
            type='file'
            className='file-input position-absolute w-100'
            onChange={({ currentTarget: { files } }) => {
              if (!files) return;

              const image = files[0];

              setBlogImg(image);
            }}
          />
        </div>

        <div className='d-flex flex-column w-75 py-2'>
          <FormField
            type='text'
            fieldName='title'
            inputVal={title}
            onChange={({ currentTarget: { value } }) => setTitle(value)}
          />
          <FormField
            type='text'
            fieldName='description'
            inputVal={description}
            onChange={({ currentTarget: { value } }) => setDescription(value)}
          />
        </div>

        <div className={`create-btn-wrapper text-white rounded p-2 mt-4 ${!shouldCreate ? 'disabled' : ''}`}>
          <div className='create-btn' onClick={createBlogHandle}>
            Create
          </div>
        </div>
      </div>
    </div>
  );
};
