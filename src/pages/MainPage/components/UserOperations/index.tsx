import { JSX, useContext } from 'react';
import { MainPageContext } from '../..';

export const UserOperations = (): JSX.Element => {
  const { setShouldShowCreateWindow } = useContext(MainPageContext);

  return (
    <div className='user-operations mt-4 p-3 rounded text-center'>
      <p>Select an action below to manage your blogs:</p>
      <div
        onClick={() => setShouldShowCreateWindow(true)}
        className='operation rounded w-100 d-flex justify-content-center align-items-center mt-4 text-white'
      >
        Create new blog
      </div>
      <div className='operation rounded w-100 d-flex justify-content-center align-items-center mt-4 text-white'>
        Edit blog
      </div>
      <div className='operation rounded w-100 d-flex justify-content-center align-items-center mt-4 text-white'>
        Delete blog
      </div>
    </div>
  );
};
