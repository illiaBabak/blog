import {
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  BLOGS_QUERY,
  CREATE_NEW_BLOG,
  GET_USER_BLOGS_QUERY,
  BLOG_IMAGE_QUERY,
  BLOG_MUTATION,
  DELETE_BLOG,
} from './constants';
import { Blog } from 'src/types/types';
import { supabase } from 'src';

const getBlogs = async (): Promise<Blog[]> => {
  const { data, error } = await supabase.from('blogs').select().order('created_at', { ascending: false });

  if (error) throw new Error('Failed to load blogs');

  return data;
};

const getBlogImage = (url: string): string => {
  const {
    data: { publicUrl },
  } = supabase.storage.from('images').getPublicUrl(`blogs/${url}`);

  return publicUrl;
};

const createBlog = async (
  title: string,
  description: string,
  imgData: { image: File; imageKey: string } | null
): Promise<void> => {
  const { error: createBlogError } = await supabase
    .from('blogs')
    .insert({ title, description, image_url: imgData ? imgData.imageKey : null })
    .select();

  if (createBlogError) throw new Error(createBlogError.stack);

  if (!imgData) return;

  const { error: uploadImageError } = await supabase.storage
    .from('images')
    .upload(`blogs/${imgData.imageKey}`, imgData.image, {
      cacheControl: '3600',
      upsert: true,
    });

  if (uploadImageError) throw new Error(uploadImageError.stack);
};

const getUserBlogs = async (userId: string): Promise<Blog[]> => {
  const { data } = await supabase
    .from('blogs')
    .select()
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return data ?? [];
};

const deleteBlogs = async (ids: number[]): Promise<void> => {
  const { error } = await supabase.from('blogs').delete().in('id', ids);

  if (error) throw new Error(error.stack);
};

export const useBlogsQuery = (): UseQueryResult<Blog[], Error> =>
  useQuery({
    queryKey: [BLOGS_QUERY],
    queryFn: getBlogs,
  });

export const useBlogImageQuery = (
  url: string,
  options?: Partial<UseQueryOptions<string>>
): UseQueryResult<string, Error> =>
  useQuery({
    queryKey: [BLOG_IMAGE_QUERY, url],
    queryFn: () => getBlogImage(url),
    ...options,
  });

export const useCreateBlog = (): UseMutationResult<
  void,
  Error,
  { title: string; description: string; imgData: { image: File; imageKey: string } | null }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [BLOG_MUTATION, CREATE_NEW_BLOG],
    mutationFn: async ({ title, description, imgData }) => await createBlog(title, description, imgData),
    onSettled: (_, __, { imgData }) => {
      queryClient.invalidateQueries({ queryKey: [BLOGS_QUERY] });
      queryClient.invalidateQueries({ queryKey: [BLOG_IMAGE_QUERY, imgData?.imageKey] });
    },
  });
};

export const useGetUserBlogsQuery = (userId: string): UseQueryResult<Blog[], Error> =>
  useQuery({
    queryKey: [GET_USER_BLOGS_QUERY, userId],
    queryFn: async () => await getUserBlogs(userId),
  });

export const useDeleteUserBlogs = (): UseMutationResult<void, Error, { ids: number[] }> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [BLOG_MUTATION, DELETE_BLOG],
    mutationFn: async ({ ids }) => await deleteBlogs(ids),
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: [BLOGS_QUERY] });
    },
  });
};
