import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { FormField } from '../../../../components/FormField';
import { useLogin, useSignInWithGoogle } from 'src/api/user';
import { LoginContext } from '../..';
import { useNavigate } from 'react-router-dom';
import { pageConfig } from 'src/config/pages';
import { validateEmail } from 'src/utils/validateEmail';

type Props = {
  setToSignUp: () => void;
};

export const LoginWindow = ({ setToSignUp }: Props): JSX.Element => {
  const { loginMessage, isSuccesedLogin, setLoginMessage } = useContext(LoginContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { mutateAsync: login } = useLogin();

  const { mutateAsync: signInWithGoogle } = useSignInWithGoogle();

  const handleLogin = () => {
    if (!validateEmail(email)) {
      setLoginMessage('Email is not valid!');
      return;
    }

    login({ email, password });
  };

  const shouldLogin = email && password;

  useEffect(() => {
    if (isSuccesedLogin) navigate(pageConfig.main);
  }, [isSuccesedLogin, navigate]);

  return (
    <div className='login-window p-3 d-flex flex-column justify-content-between mb-4'>
      <div>
        <h1 className='mb-1'>Welcome back!</h1>
        <p className='sub-text pb-2'>Welcome back! Please enter your details</p>
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
      <p className='error-text mb-0'>{loginMessage ? loginMessage : ''}</p>
      <div className='d-flex flex-column text-center mt-3'>
        <div className={`btn-wrapper ${!shouldLogin ? 'disabled' : ''}`}>
          <div className='submit-btn text-white p-1 py-2 rounded' onClick={handleLogin}>
            Log in
          </div>
        </div>

        <div onClick={setToSignUp} className='mt-3 change-btn'>
          Don't have any account? Sign up
        </div>

        <p className='mb-0'>or</p>

        <div
          className='d-flex flex-row google-btn rounded p-1 justify-content-center align-items-center w-75 align-self-center'
          onClick={signInWithGoogle}
        >
          <img className='object-fit-contain google-logo' src='/google-logo.webp' alt='google-logo' />
          <p className='ms-2 mb-0'>Continue with Google</p>
        </div>
      </div>
    </div>
  );
};
