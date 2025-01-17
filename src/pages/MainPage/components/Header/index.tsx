import { JSX, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ThemeBtn } from 'src/components/ThemeBtn';

export const Header = (): JSX.Element => {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchedText = searchParams.get('query') ?? '';

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFocusInput = () => inputRef.current?.focus();

  const handleClearParam = () => {
    searchParams.delete('query');
    setSearchParams(searchParams);

    if (inputRef.current) inputRef.current.value = '';
  };

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
            ref={inputRef}
            className='search-input ps-2'
            type='text'
            placeholder='Search...'
            defaultValue={searchedText}
            onBlur={({ currentTarget: { value } }) => (value ? setSearchParams({ query: value }) : handleClearParam())}
            onKeyDown={(e) => {
              if (e.key === 'Enter') e.currentTarget.blur();
            }}
          />
          {searchedText && (
            <div className='clear-btn fs-5 position-absolute' onClick={handleClearParam}>
              x
            </div>
          )}
        </div>
      </div>

      <ThemeBtn />
    </div>
  );
};
