import { UseMutationResult, UseQueryResult, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from 'src';
import {
  USER_GOOGLE_SIGN_IN,
  USER_IMAGE_QUERY,
  USER_IMAGE_UPLOAD,
  USER_LOGIN,
  USER_MUTATION,
  USER_QUERY,
  USER_SIGN_UP,
  USER_UPDATE_METADATA,
} from './constants';
import { useContext } from 'react';
import { LoginContext } from 'src/pages/LoginPage';
import { User } from '@supabase/supabase-js';
import { pageConfig } from 'src/config/pages';

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
      emailRedirectTo: `http://localhost:3000${pageConfig.confirm}`,
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

const uploadImage = async ({ email, file }: { email: string; file: File }): Promise<void> => {
  const { error } = await supabase.storage.from('images').upload(`pfp/${email}`, file, {
    cacheControl: '3600',
    upsert: true,
  });

  if (error) throw new Error(error.stack);
};

const getUserImage = (email: string) => {
  const {
    data: { publicUrl },
  } = supabase.storage.from('images').getPublicUrl(`pfp/${email}`);

  return publicUrl;
};

const signInWithOAuth = async (): Promise<void> => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `http://localhost:3000${pageConfig.main}`,
    },
  });

  if (error) throw new Error(error.stack);
};

const updateUserMetadata = async (username: string): Promise<void> => {
  const { error } = await supabase.auth.updateUser({
    data: { username },
  });

  if (error) throw new Error(error.stack);
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

export const useUploadImage = (): UseMutationResult<void, Error, { email: string; file: File }> => {
  return useMutation({
    mutationFn: uploadImage,
    mutationKey: [USER_MUTATION, USER_IMAGE_UPLOAD],
  });
};

export const useGetUserImageQuery = (email: string): UseQueryResult<string, Error> =>
  useQuery({
    queryKey: [USER_IMAGE_QUERY, email],
    queryFn: () => {
      return getUserImage(email);
    },
  });

export const useSignInWithGoogle = (): UseMutationResult<void, Error> => {
  const { setLoginMessage } = useContext(LoginContext);

  return useMutation({
    mutationKey: [USER_MUTATION, USER_GOOGLE_SIGN_IN],
    mutationFn: signInWithOAuth,
    onSuccess: () => {
      setLoginMessage(null);
    },
    onError: (error) => {
      setLoginMessage(error.message);
    },
  });
};

export const useUpdateUserMetadata = (): UseMutationResult<void, Error, { username: string }> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [USER_MUTATION, USER_UPDATE_METADATA],
    mutationFn: async ({ username }) => {
      return await updateUserMetadata(username);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [USER_QUERY] });
    },
  });
};
