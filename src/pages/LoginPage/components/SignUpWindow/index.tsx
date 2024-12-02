import { useContext, useEffect, useState } from 'react';
import { FormField } from '../FormField';
import { useSignUp, useUploadImage } from 'src/api/user';
import { LoginContext } from '../..';
import { useNavigate } from 'react-router-dom';
import { pageConfig } from 'src/config/pages';

type AuthMessage = {
  type: 'VERIFIED';
};

type Props = {
  setToLogin: () => void;
};

export const SignUpWindow = ({ setToLogin }: Props): JSX.Element => {
  const { loginMessage } = useContext(LoginContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [shouldConfirmEmail, setShouldConfirmEmail] = useState(false);
  const [pfp, setPfp] = useState<File | null>();

  const isIdenticalPasswords = password === confirmedPassword;

  const shouldSignUp = username && email && password && confirmedPassword && isIdenticalPasswords;

  const { mutateAsync: uploadUserImage } = useUploadImage();

  const { mutateAsync: signUp } = useSignUp();

  const handleSignUp = () => {
    signUp({ email, password, optionalData: { username } });
    setShouldConfirmEmail(true);
  };

  useEffect(() => {
    if (loginMessage) setShouldConfirmEmail(false);
  }, [loginMessage, setShouldConfirmEmail]);

  useEffect(() => {
    const channel = new BroadcastChannel('auth_channel');

    const handleMessage = ({ data: { type } }: MessageEvent<AuthMessage>) => {
      if (type === 'VERIFIED' && pfp) {
        uploadUserImage({ email: email.split('@')[0], file: pfp });
        navigate(pageConfig.main);
      }
    };

    channel.addEventListener('message', handleMessage);

    return () => {
      channel.removeEventListener('message', handleMessage);
      channel.close();
    };
  }, [navigate, pfp, email, uploadUserImage]);

  return (
    <div className='sign-up-window p-3 d-flex flex-column text-center justify-content-between'>
      <div>
        <h2>Sign up</h2>
        <div className='position-relative'>
          <img
            className='icon object-fit-contain rounded-circle'
            src={pfp ? URL.createObjectURL(pfp) : '/empty-pfp.png'}
            alt='pfp'
          />
          <input
            type='file'
            className='file-input position-absolute'
            onChange={({ currentTarget: { files } }) => {
              if (!files) return;

              const image = files[0];

              setPfp(image);
            }}
          />
        </div>

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
      <p className='error-text'>
        {!isIdenticalPasswords && '*Passwords are not identical!'}
        {loginMessage ? loginMessage : ''}
        {shouldConfirmEmail && !loginMessage && 'Check your email to confirm!'}
      </p>
      <div>
        <div className={`btn-wrapper ${!shouldSignUp || shouldConfirmEmail ? 'disabled' : ''}`}>
          <div onClick={handleSignUp} className='submit-btn text-white p-1 rounded'>
            Sign up
          </div>
        </div>

        <div onClick={setToLogin} className='mt-3 change-btn'>
          Already have any account? Sign in
        </div>
      </div>
    </div>
  );
};
