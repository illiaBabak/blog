import {
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { supabase } from 'src';
import {
  BLOG_GET_USER_BLOGS_QUERY,
  USER_GET_BY_ID,
  USER_GOOGLE_SIGN_IN,
  USER_IMAGE_QUERY,
  USER_LOGIN,
  USER_MUTATION,
  USER_QUERY,
  USER_SIGN_OUT,
  USER_SIGN_UP,
  USER_UPDATE_PUBLIC_DATA,
  USER_UPLOAD_USER_IMAGE,
} from './constants';
import { useContext } from 'react';
import { LoginContext } from 'src/pages/LoginPage';
import { User } from '@supabase/supabase-js';
import { pageConfig } from 'src/config/pages';
import { PublicUser } from 'src/types/types';
import { SUPABASE_URL } from 'src/utils/constants';

const updatePublicData = async ({
  email,
  userId,
  username,
  imageUrl,
}: {
  email: string;
  userId: string;
  username: string;
  imageUrl: string;
}): Promise<void> => {
  const { error } = await supabase.from('users').upsert({
    email,
    user_id: userId,
    username,
    image_url: imageUrl,
  });

  if (error) throw new Error(error.message);
};

const uploadUserImage = async (email: string, file: File) => {
  await supabase.storage.from('images').remove([`pfp/${email}`]);

  const { error } = await supabase.storage.from('images').upload(`pfp/${email}`, file, {
    cacheControl: '0',
    upsert: true,
  });

  if (error) throw new Error(error.stack);
};

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
  file,
}: {
  email: string;
  password: string;
  optionalData: {
    username: string;
  };
  file: File | null;
}): Promise<void> => {
  const {
    data: { user },
    error,
  } = await supabase.auth.signUp({
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

  if (user) {
    if (file) await uploadUserImage(email, file);

    await updatePublicData({
      email,
      username: optionalData.username,
      userId: user.id,
      imageUrl: `${SUPABASE_URL}/storage/v1/object/public/images/pfp/${email}`,
    });
  }
};

const getUser = async (): Promise<User | null> => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw new Error(error.stack);

  return user;
};

const getUserImage = async (userId: string): Promise<string> => {
  const { data } = await supabase.from('users').select().eq('user_id', userId);

  return data?.[0].image_url ?? '';
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

const updateUser = async (username: string, imageUrl?: string): Promise<void> => {
  const {
    data: { user },
    error,
  } = await supabase.auth.updateUser({
    data: { username },
  });

  if (error) throw new Error(error.stack);

  if (user) await updatePublicData({ email: user.email ?? '', username, userId: user.id, imageUrl: imageUrl ?? '' });
};

const getUserById = async (userId: string): Promise<PublicUser | null> => {
  const { data, error } = await supabase.from('users').select().eq('user_id', userId);

  if (error) throw new Error(error.stack);

  return data[0] ?? null;
};

const signOut = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();

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
    file: File | null;
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

export const useGetUserImageQuery = (
  email: string,
  options?: Partial<UseQueryOptions<string>>
): UseQueryResult<string, Error> =>
  useQuery({
    queryKey: [USER_IMAGE_QUERY, email],
    queryFn: async () => {
      return await getUserImage(email);
    },
    ...options,
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

export const useUpdateUserPublicData = (): UseMutationResult<
  void,
  Error,
  { userId: string; username: string; email: string; imageUrl?: string }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [USER_MUTATION, USER_UPDATE_PUBLIC_DATA],
    mutationFn: async ({ username, imageUrl }) => {
      return await updateUser(username, imageUrl);
    },
    onSettled: async (_, __, { email, userId }) => {
      await queryClient.invalidateQueries({ queryKey: [USER_QUERY] });
      await queryClient.invalidateQueries({ queryKey: [USER_GET_BY_ID, userId] });
      await queryClient.invalidateQueries({ queryKey: [USER_IMAGE_QUERY, email] });
    },
  });
};

export const useGetUserByIdQuery = (
  userId: string,
  options?: Partial<UseQueryOptions<PublicUser | null>>
): UseQueryResult<PublicUser | null, Error> =>
  useQuery({
    queryKey: [USER_GET_BY_ID, userId],
    queryFn: async () => {
      return await getUserById(userId);
    },
    ...options,
  });

export const useSignOut = (): UseMutationResult<void, Error, void, unknown> => {
  return useMutation({
    mutationKey: [USER_MUTATION, USER_SIGN_OUT],
    mutationFn: signOut,
  });
};

export const useUploadUserImage = (): UseMutationResult<void, Error, { userId: string; email: string; file: File }> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, file }) => {
      await uploadUserImage(email, file);
    },
    mutationKey: [USER_MUTATION, USER_UPLOAD_USER_IMAGE],

    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: [USER_IMAGE_QUERY] });
      await queryClient.invalidateQueries({ queryKey: [BLOG_GET_USER_BLOGS_QUERY] });
    },
  });
};
