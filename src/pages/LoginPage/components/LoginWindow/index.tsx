import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { FormField } from '../FormField';
import { useLogin } from 'src/api/user';
import { LoginContext } from '../..';
import { useNavigate } from 'react-router-dom';
import { pageConfig } from 'src/config/pages';

type Props = {
  setToSignUp: () => void;
};

export const LoginWindow = ({ setToSignUp }: Props): JSX.Element => {
  const { loginMessage, isSuccesedLogin } = useContext(LoginContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { mutateAsync: login } = useLogin();

  const handleLogin = () => login({ email, password });

  const shouldLogin = email && password;

  useEffect(() => {
    if (isSuccesedLogin) navigate(pageConfig.main);
  }, [isSuccesedLogin, navigate]);

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
      <p className='error-text'>{loginMessage ? loginMessage : ''}</p>
      <div>
        <div className={`btn-wrapper ${!shouldLogin ? 'disabled' : ''}`}>
          <div className='submit-btn text-white p-1 rounded' onClick={handleLogin}>
            Log in
          </div>
        </div>

        <div onClick={setToSignUp} className='mt-3 change-btn'>
          Don't have any account? Sign up
        </div>
      </div>
    </div>
  );
};
