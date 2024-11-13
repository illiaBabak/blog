import { ChangeEvent, useState } from 'react';
import { FormField } from '../FormField';

type Props = {
  setToSignUp: () => void;
};

export const LoginWindow = ({ setToSignUp }: Props): JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className='login-window p-3 d-flex flex-column justify-content-between text-center'>
      <div>
        <h1>Login</h1>
        <FormField
          type='text'
          inputVal={email}
          fieldName='Email'
          onChange={({ currentTarget: { value } }: ChangeEvent<HTMLInputElement>) => setEmail(value)}
        />
        <FormField
          type='password'
          inputVal={password}
          fieldName='Password'
          onChange={({ currentTarget: { value } }: ChangeEvent<HTMLInputElement>) => setPassword(value)}
        />
      </div>
      <div>
        <div className='submit-btn text-white p-1 rounded' onClick={() => {}}>
          Log in
        </div>
        <div onClick={setToSignUp} className='mt-3 change-btn'>
          Don't have any account? Sign up
        </div>
      </div>
    </div>
  );
};
