import { UseMutationResult, UseQueryResult, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BLOGS_QUERY, BLOG_CREATE_BLOG, BLOG_IMAGE_QUERY, BLOG_MUTATION } from './constants';
import { Blog } from 'src/types/types';
import { supabase } from 'src';
import { generateKey } from 'src/utils/generateKey';

const getBlogs = async (): Promise<Blog[]> => {
  const { data, error } = await supabase.from('blogs').select();

  if (error) throw new Error('Failed to load blogs');

  return data;
};

const getBlogImage = (url: string | null): string | null => {
  if (!url) return null;

  const {
    data: { publicUrl },
  } = supabase.storage.from('images').getPublicUrl(`blogs/${url}`);

  return publicUrl;
};

const uploadBlogImage = async (image: File, imageKey: string) => {
  const { error } = await supabase.storage.from('images').upload(`blogs/${imageKey}`, image, {
    cacheControl: '3600',
    upsert: true,
  });

  if (error) throw new Error(error.stack);
};

const createBlog = async (title: string, description: string, image: File | null): Promise<void> => {
  const imageKey = generateKey(16);

  const { error } = await supabase
    .from('blogs')
    .insert({ title, description, image_url: image ? imageKey : null })
    .select();

  if (error) throw new Error(error.stack);

  if (image) uploadBlogImage(image, imageKey);
};

export const useBlogsQuery = (): UseQueryResult<Blog[], Error> =>
  useQuery({
    queryKey: [BLOGS_QUERY],
    queryFn: getBlogs,
  });

export const useBlogImageQuery = (url: string | null): UseQueryResult<string | null, Error> =>
  useQuery({
    queryKey: [BLOG_IMAGE_QUERY, url],
    queryFn: () => {
      return getBlogImage(url);
    },
  });

export const useCreateBlog = (): UseMutationResult<
  void,
  Error,
  { title: string; description: string; image: File | null }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [BLOG_MUTATION, BLOG_CREATE_BLOG],
    mutationFn: async ({ title, description, image }) => {
      return await createBlog(title, description, image);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [BLOGS_QUERY] });
    },
  });
};
