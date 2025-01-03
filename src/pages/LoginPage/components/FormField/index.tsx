import { ChangeEvent, useRef } from 'react';

type Props = {
  fieldName: string;
  inputVal: string;
  type: 'text' | 'password';
  onChange: ({ currentTarget: { value } }: ChangeEvent<HTMLInputElement>) => void;
};

export const FormField = ({ fieldName, inputVal, type, onChange }: Props): JSX.Element => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const focusInput = () => inputRef.current?.focus();

  return (
    <div
      className='field d-flex flex-column justify-content-between align-items-start w-100 mt-4 p-2 rounded'
      onClick={focusInput}
    >
      <p className='name mb-1'>{fieldName}</p>
      <input ref={inputRef} className='field-input w-100' type={type} value={inputVal} onChange={onChange} />
    </div>
  );
};
