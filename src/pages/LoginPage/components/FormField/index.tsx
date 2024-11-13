import { ChangeEvent } from 'react';

type Props = {
  fieldName: string;
  inputVal: string;
  type: 'text' | 'password';
  onChange: ({ currentTarget: { value } }: ChangeEvent<HTMLInputElement>) => void;
};

export const FormField = ({ fieldName, inputVal, type, onChange }: Props): JSX.Element => {
  return (
    <div className='field d-flex flex-row justify-content-between w-100 px-4 mt-4'>
      <p>{fieldName}</p>
      <input className='field-input' type={type} value={inputVal} onChange={onChange} />
    </div>
  );
};
