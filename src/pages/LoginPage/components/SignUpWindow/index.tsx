import { useContext, useEffect, useState } from 'react';
import { FormField } from '../FormField';
import { useSignUp, useUploadImage } from 'src/api/user';
import { LoginContext } from '../..';
import { useNavigate } from 'react-router-dom';
import { pageConfig } from 'src/config/pages';
import { validateEmail } from 'src/utils/validateEmail';

type AuthMessage = {
  type: 'VERIFIED';
};

type Props = {
  setToLogin: () => void;
};

export const SignUpWindow = ({ setToLogin }: Props): JSX.Element => {
  const { loginMessage, setLoginMessage } = useContext(LoginContext);
  const navigate = useNavigate();

  const [shouldClickSignUpBtn, setShouldClickSignUpBtn] = useState(true); // State for handle multiple click on sign up btn
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [shouldConfirmEmail, setShouldConfirmEmail] = useState(false);
  const [pfp, setPfp] = useState<File | null>();

  const isIdenticalPasswords = password === confirmedPassword;

  const passwordCorectLength = password.length >= 6; // Password should be at least 6 characters

  const shouldSignUp =
    username && email && password && confirmedPassword && isIdenticalPasswords && passwordCorectLength;

  const { mutateAsync: uploadUserImage } = useUploadImage();

  const { mutateAsync: signUp } = useSignUp();

  const handleSignUp = () => {
    if (!validateEmail(email)) {
      setLoginMessage('Email is not valid!');
      return;
    }

    signUp({ email, password, optionalData: { username } });
    setShouldConfirmEmail(true);
    setShouldClickSignUpBtn(false);
  };

  useEffect(() => {
    if (shouldClickSignUpBtn) return;

    setTimeout(() => {
      setShouldClickSignUpBtn(true);
    }, 5000);
  }, [shouldClickSignUpBtn]);

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
      <div className='d-flex flex-column content justify-content-center'>
        <h3>Sign up</h3>
        <div className='d-flex flex-column align-items-center mt-2'>
          <div className='position-relative d-flex img-wrapper'>
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
          <p className='m-0 mt-1'>{pfp ? pfp.name : 'Empty profile picture'}</p>
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
          fieldName='Confirmed password'
          inputVal={confirmedPassword}
          type='password'
          onChange={({ currentTarget: { value } }) => setConfirmedPassword(value)}
        />
      </div>
      <div className='error-text my-2 d-flex flex-column'>
        {!isIdenticalPasswords && <p className='mb-0'>*Passwords are not identical!</p>}
        {!passwordCorectLength && password.length !== 0 && (
          <p className='mb-0'>*Password should be at least 6 characters!</p>
        )}
        {!!loginMessage && isIdenticalPasswords && passwordCorectLength && <p className='mb-0'>{loginMessage}</p>}
        {shouldConfirmEmail && !loginMessage && <p className='mb-0'>Check your email to confirm!</p>}
      </div>
      <div>
        <div className={`btn-wrapper ${!shouldSignUp || !shouldClickSignUpBtn ? 'disabled' : ''}`}>
          <div onClick={handleSignUp} className='submit-btn text-white p-1 py-2 rounded'>
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
