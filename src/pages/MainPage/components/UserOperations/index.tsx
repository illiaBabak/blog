import { JSX } from 'react';

type Props = {
  showCreateWindow: () => void;
  showDeleteWindow: () => void;
  showEditWindow: () => void;
};

export const UserOperations = ({ showCreateWindow, showDeleteWindow, showEditWindow }: Props): JSX.Element => (
  <div className='user-operations mt-4 p-3 rounded text-center'>
    <p>Select an action below to manage your blogs:</p>
    <div
      onClick={showCreateWindow}
      className='operation rounded w-100 d-flex justify-content-center align-items-center mt-4 text-white'
    >
      Create new blog
    </div>
    <div
      onClick={showEditWindow}
      className='operation rounded w-100 d-flex justify-content-center align-items-center mt-4 text-white'
    >
      Edit blog
    </div>
    <div
      onClick={showDeleteWindow}
      className='operation rounded w-100 d-flex justify-content-center align-items-center mt-4 text-white'
    >
      Delete blog
    </div>
  </div>
);
