import { createContext, useState } from 'react';
import { ThemeBtn } from 'src/components/ThemeBtn';
import { LoginWindow } from 'src/pages/LoginPage/components/LoginWindow';
import { SignUpWindow } from 'src/pages/LoginPage/components/SignUpWindow';

type LoginContextType = {
  loginMessage: string | null;
  setLoginMessage: React.Dispatch<React.SetStateAction<string | null>>;
  isSuccesedLogin: boolean;
  setIsSuccesedLogin: React.Dispatch<React.SetStateAction<boolean>>;
};

export const LoginContext = createContext<LoginContextType>({
  loginMessage: null,
  setLoginMessage: () => {
    throw new Error('Login context is not initalized');
  },
  isSuccesedLogin: false,
  setIsSuccesedLogin: () => {
    throw new Error('Login context is not initalized');
  },
});

export const LoginPage = (): JSX.Element => {
  const [isLogin, setIsLogin] = useState(true);
  const [isSuccesedLogin, setIsSuccesedLogin] = useState(false);
  const [loginMessage, setLoginMessage] = useState<string | null>(null);

  return (
    <LoginContext.Provider value={{ loginMessage, setLoginMessage, isSuccesedLogin, setIsSuccesedLogin }}>
      <div className='login-page d-flex flex-column w-100 h-100 p-2'>
        <ThemeBtn />
        <div className='m-auto'>
          {isLogin ? (
            <LoginWindow setToSignUp={() => setIsLogin(false)} />
          ) : (
            <SignUpWindow setToLogin={() => setIsLogin(true)} />
          )}
        </div>
      </div>
    </LoginContext.Provider>
  );
};
