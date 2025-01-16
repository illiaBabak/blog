import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  onClose: () => void;
};

export const WindowWrapper = ({ children, onClose }: Props): JSX.Element => {
  return (
    <div
      className='wrapper position-absolute d-flex justify-content-center align-items-center overflow-hidden'
      onClick={onClose}
    >
      {children}
    </div>
  );
};
