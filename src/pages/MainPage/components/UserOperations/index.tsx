import { JSX } from 'react';
import { useGetDeviceType } from 'src/hooks/useGetDeviceType';

type Props = {
  showCreateWindow: () => void;
  showDeleteWindow: () => void;
  showEditWindow: () => void;
};

export const UserOperations = ({ showCreateWindow, showDeleteWindow, showEditWindow }: Props): JSX.Element => {
  const { isMobile } = useGetDeviceType();

  const operationClassName = `operation rounded w-100 d-flex justify-content-center align-items-center ${isMobile ? 'mx-2' : 'mt-4'} text-white`;

  return (
    <div
      className={`user-operations mt-4 rounded text-center ${isMobile ? 'd-flex flex-row align-items-center w-100 p-1' : 'p-3'}`}
    >
      {!isMobile && <p>Select an action below to manage your blogs:</p>}
      <div onClick={showCreateWindow} className={operationClassName}>
        Create new blog
      </div>
      <div onClick={showEditWindow} className={operationClassName}>
        Edit blog
      </div>
      <div onClick={showDeleteWindow} className={operationClassName}>
        Delete blog
      </div>
    </div>
  );
};
