import { useState } from 'react';
import { LoginWindow } from 'src/pages/LoginPage/components/LoginWindow';
import { SignUpWindow } from 'src/pages/LoginPage/components/SignUpWindow';

export const LoginPage = (): JSX.Element => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className='login-page d-flex justify-content-center align-items-center w-100 h-100'>
      {isLogin ? (
        <LoginWindow setToSignUp={() => setIsLogin(false)} />
      ) : (
        <SignUpWindow setToLogin={() => setIsLogin(true)} />
      )}
    </div>
  );
};
