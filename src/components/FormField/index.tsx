import { ChangeEvent, JSX, useRef, useState } from 'react';

type Props = {
  fieldName: string;
  inputVal: string;
  type: 'text' | 'password';
  onChange: ({ currentTarget: { value } }: ChangeEvent<HTMLInputElement>) => void;
};

export const FormField = ({ fieldName, inputVal, type, onChange }: Props): JSX.Element => {
  const [shouldShowPassword, setShouldShowPassword] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const focusInput = () => inputRef.current?.focus();

  return (
    <div
      className='field d-flex flex-column justify-content-between w-100 align-items-start mt-4 p-2 rounded position-relative'
      onClick={focusInput}
    >
      <p className='name mb-1'>{fieldName}</p>
      <input
        ref={inputRef}
        className='field-input w-100'
        type={shouldShowPassword ? 'text' : type}
        value={inputVal}
        onChange={onChange}
      />
      {type === 'password' && (
        <img
          onClick={() => setShouldShowPassword((prev) => !prev)}
          className='object-fit-contain eye-icon position-absolute rounded-circle p-1'
          src={shouldShowPassword ? '/show.png' : 'hide.png'}
          alt='eye-icon'
        />
      )}
    </div>
  );
};
