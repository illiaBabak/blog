import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { BLOGS_QUERY, BLOG_IMAGE_QUERY } from './constants';
import { supabase } from 'src/root';
import { Blog } from 'src/types/types';

const getBlogs = async (): Promise<Blog[]> => {
  const { data, error } = await supabase.from('blogs').select();
  console.log(data);
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
