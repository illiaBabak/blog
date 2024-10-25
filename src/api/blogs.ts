import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { BLOGS_QUERY, BLOG_IMAGE_QUERY } from './constants';
import { supabase } from 'src/root';
import { Blog } from 'src/types/types';

export const useBlogsQuery = (): UseQueryResult<Blog[], Error> =>
  useQuery({
    queryKey: [BLOGS_QUERY],
    queryFn: async () => {
      const { data, error } = await supabase.from('blogs').select();

      if (error) throw new Error('Failed to load blogs');

      return data;
    },
  });

export const useBlogImageQuery = (url: string | null): UseQueryResult<string | null, Error> =>
  useQuery({
    queryKey: [BLOG_IMAGE_QUERY, url],
    queryFn: () => {
      if (!url) return null;

      const {
        data: { publicUrl },
      } = supabase.storage.from('images').getPublicUrl(`blogs/${url}`);

      return publicUrl;
    },
  });
