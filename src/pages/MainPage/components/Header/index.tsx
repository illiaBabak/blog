import { JSX, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ThemeBtn } from 'src/components/ThemeBtn';
import { useGetDeviceType } from 'src/hooks/useGetDeviceType';

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

  const { isMobile } = useGetDeviceType();

  return (
    <div
      className={`header w-100 d-flex ${isMobile ? 'flex-column-reverse' : 'flex-row'} align-items-center justify-content-between px-4 py-1`}
    >
      <div className={`d-flex flex-row w-100 ${isMobile ? 'pb-2' : ''}`}>
        <h3 className='m-0 title'>Blog</h3>
        <div
          className={`search-container ${isMobile ? 'w-100' : ''} d-flex flex-row align-items-center ms-3 rounded ps-2 pe-4 py-1 position-relative`}
          onClick={handleFocusInput}
        >
          <img className='search-icon object-fit-contain' src='/search.png' alt='search-icon' />
          <input
            ref={inputRef}
            className={`search-input ps-2 ${isMobile ? 'w-100' : ''}`}
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
