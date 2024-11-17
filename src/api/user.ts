import { UseMutationResult, UseQueryResult, useMutation, useQuery } from '@tanstack/react-query';
import { GlobalContext, supabase } from 'src/root';
import { USER_LOGIN, USER_MUTATION, USER_QUERY, USER_SIGN_UP } from './constants';
import { useContext } from 'react';
import { LoginContext } from 'src/pages/LoginPage';
import { User } from '@supabase/supabase-js';

const login = async ({ email, password }: { email: string; password: string }): Promise<void> => {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);
};

const signUp = async ({
  email,
  password,
  optionalData,
}: {
  email: string;
  password: string;
  optionalData: {
    username: string;
  };
}): Promise<void> => {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: optionalData.username,
      },
      emailRedirectTo: 'http://localhost:3000/confirm',
    },
  });

  if (error) throw new Error(error.message);
};

const getUser = async (): Promise<User | null> => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw new Error(error.stack);

  return user;
};

export const useLogin = (): UseMutationResult<void, Error, { email: string; password: string }> => {
  const { setLoginMessage, setIsSuccesedLogin } = useContext(LoginContext);

  return useMutation({
    mutationKey: [USER_MUTATION, USER_LOGIN],
    mutationFn: login,
    onSuccess: () => {
      setLoginMessage(null);
      setIsSuccesedLogin(true);
    },
    onError: (error) => {
      setLoginMessage(error.message);
    },
  });
};

export const useSignUp = (): UseMutationResult<
  void,
  Error,
  {
    email: string;
    password: string;
    optionalData: {
      username: string;
    };
  }
> => {
  const { setLoginMessage } = useContext(LoginContext);

  return useMutation({
    mutationKey: [USER_MUTATION, USER_SIGN_UP],
    mutationFn: signUp,
    onSuccess: () => {
      setLoginMessage(null);
    },
    onError: (error) => {
      setLoginMessage(error.message);
    },
  });
};

export const useGetUserQuery = (): UseQueryResult<User | null, Error> =>
  useQuery({
    queryKey: [USER_QUERY],
    queryFn: getUser,
  });
