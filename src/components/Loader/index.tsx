import { JSX } from 'react';

export const Loader = (): JSX.Element => (
  <div className='loader-wrapper position-fixed'>
    <div className='loader d-grid rounded-circle' />
  </div>
);
