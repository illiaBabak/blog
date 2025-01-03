import { useRef, useState } from 'react';
import { ThemeBtn } from 'src/components/ThemeBtn';

export const Header = (): JSX.Element => {
  const [searchText, setSearchText] = useState('');

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFocusInput = () => inputRef.current?.focus();

  return (
    <div className='header w-100 d-flex flex-row align-items-center justify-content-between px-4 py-1'>
      <div className='d-flex flex-row'>
        <h3 className='m-0 title'>Blog</h3>
        <div
          className='search-container d-flex flex-row align-items-center ms-3 rounded ps-2 pe-4 py-1 position-relative'
          onClick={handleFocusInput}
        >
          <img className='search-icon object-fit-contain' src='/search.png' alt='search-icon' />
          <input
            className='search-input ps-2'
            type='text'
            placeholder='Search...'
            value={searchText}
            onChange={({ currentTarget: { value } }) => setSearchText(value)}
          />
          {searchText && (
            <div className='clear-btn fs-5 position-absolute' onClick={() => setSearchText('')}>
              x
            </div>
          )}
        </div>
      </div>

      <ThemeBtn />
    </div>
  );
};
