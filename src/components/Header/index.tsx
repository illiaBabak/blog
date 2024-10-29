import { ThemeBtn } from '../ThemeBtn';

export const Header = (): JSX.Element => (
  <div className='header w-100 d-flex flex-row align-items-center justify-content-between px-4 py-1'>
    <h3 className='m-0 title'>Blog</h3>
    <ThemeBtn />
  </div>
);
