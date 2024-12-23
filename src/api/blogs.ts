import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { BLOGS_QUERY, BLOG_IMAGE_QUERY } from './constants';
import { Blog } from 'src/types/types';
import { supabase } from 'src';

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
