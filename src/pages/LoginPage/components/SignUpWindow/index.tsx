import { useState } from 'react';
import { FormField } from '../FormField';

type Props = {
  setToLogin: () => void;
};

export const SignUpWindow = ({ setToLogin }: Props): JSX.Element => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');

  return (
    <div className='sign-up-window p-3 d-flex flex-column text-center justify-content-between'>
      <div>
        <h2>Sign up</h2>
        <FormField
          fieldName='Username'
          inputVal={username}
          type='text'
          onChange={({ currentTarget: { value } }) => setUsername(value)}
        />
        <FormField
          fieldName='Email'
          inputVal={email}
          type='text'
          onChange={({ currentTarget: { value } }) => setEmail(value)}
        />
        <FormField
          fieldName='Password'
          inputVal={password}
          type='password'
          onChange={({ currentTarget: { value } }) => setPassword(value)}
        />

        <FormField
          fieldName='Confirmed'
          inputVal={confirmedPassword}
          type='password'
          onChange={({ currentTarget: { value } }) => setConfirmedPassword(value)}
        />
      </div>
      <div>
        <div onClick={() => {}} className='submit-btn text-white p-1 rounded'>
          Sign up
        </div>
        <div onClick={setToLogin} className='mt-3 change-btn'>
          Already have any account? Sign in
        </div>
      </div>
    </div>
  );
};
