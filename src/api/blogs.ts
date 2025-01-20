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
  SEARCH_BLOGS,
  EDIT_BLOG,
  GET_BLOG_BY_ID,
} from './constants';
import { Blog } from 'src/types/types';
import { supabase } from 'src';
import { SUPABASE_URL } from 'src/utils/constants';

const getBlogs = async (): Promise<Blog[]> => {
  const { data, error } = await supabase.from('blogs').select().order('created_at', { ascending: false });

  if (error) throw new Error('Failed to load blogs');

  return data;
};

const getBlogImage = async (blogId: number): Promise<string | null> => {
  const { data, error } = await supabase.from('blogs').select().eq('id', blogId);

  if (error) throw new Error('Something went wrong with getting blog image');

  return data[0].image_url ?? null;
};

const createBlog = async (title: string, description: string, img: File | null): Promise<void> => {
  const { data: createdBlog, error: createBlogError } = await supabase
    .from('blogs')
    .insert({
      title,
      description,
      image_url: null,
    })
    .select();

  if (createBlogError) throw new Error(createBlogError.stack);

  if (!img) return;

  const { error: updateImageUrlError } = await supabase
    .from('blogs')
    .update({ image_url: `${SUPABASE_URL}/storage/v1/object/public/images/blogs/${createdBlog[0].id}?t=${Date.now()}` })
    .eq('id', createdBlog[0].id); // Match the blog by its `id`

  if (updateImageUrlError) {
    throw new Error(`Failed to update image_url: ${updateImageUrlError.message}`);
  }

  const { error: uploadImageError } = await supabase.storage.from('images').upload(`blogs/${createdBlog[0].id}`, img, {
    cacheControl: '0',
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
  const { error: errorBlogs } = await supabase.from('blogs').delete().in('id', ids);

  const { error: errorComments } = await supabase.from('comments').delete().in('blog_id', ids);

  ids.forEach((id) => supabase.storage.from('images').remove([`blogs/${id}`]));

  if (errorBlogs) throw new Error(errorBlogs.stack);
  else if (errorComments) throw new Error(errorComments.stack);
};

const getSearchedBlogs = async (searchedText: string): Promise<Blog[]> => {
  const { data: searchedBlogsByTitle } = await supabase
    .from('blogs')
    .select()
    .textSearch('title', `${searchedText.split(' ').join('|')}`);

  const { data: searchedBlogsByDescription } = await supabase
    .from('blogs')
    .select()
    .textSearch('description', `${searchedText.split(' ').join('|')}`); // if I don't have any blogs with keywords in title

  if (searchedBlogsByTitle?.length) return searchedBlogsByTitle;

  return searchedBlogsByDescription ?? [];
};

const editBlog = async (blog: Blog, newImg: File | null): Promise<void> => {
  const { error: errorInfo } = await supabase.from('blogs').update(blog).eq('id', blog.id);

  if (errorInfo) throw new Error('Something went wrong with edited blog info');

  if (!newImg) return;

  await supabase.storage.from('images').remove([`blogs/${blog.id}`]);

  const { error: errorToUploadImg } = await supabase.storage
    .from('images')
    .upload(`blogs/${blog.id}?t=${Date.now()}`, newImg, { cacheControl: '0', upsert: true });

  if (errorToUploadImg) throw new Error('Something went wrong with edited blog img');
};

const getBlogById = async (blogId: number): Promise<Blog | null> => {
  const { data, error } = await supabase.from('blogs').select().eq('id', blogId);

  if (error) throw new Error('Something went wrong with getting blog by id');

  return data[0] ?? null;
};

export const useBlogsQuery = (): UseQueryResult<Blog[], Error> =>
  useQuery({
    queryKey: [BLOGS_QUERY],
    queryFn: getBlogs,
  });

export const useBlogImageQuery = (
  blogId: number,
  options?: Partial<UseQueryOptions<string | null>>
): UseQueryResult<string | null, Error> =>
  useQuery({
    queryKey: [BLOG_IMAGE_QUERY, blogId],
    queryFn: async () => {
      return await getBlogImage(blogId);
    },
    ...options,
  });

export const useCreateBlog = (): UseMutationResult<
  void,
  Error,
  { title: string; description: string; img: File | null }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [BLOG_MUTATION, CREATE_NEW_BLOG],
    mutationFn: async ({ title, description, img }) => await createBlog(title, description, img),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [BLOGS_QUERY] });
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

export const useGetSearchBlogsQuery = (
  searchedText: string,
  options?: Partial<UseQueryOptions<Blog[]>>
): UseQueryResult<Blog[], Error> =>
  useQuery({
    queryKey: [SEARCH_BLOGS, searchedText],
    queryFn: async () => {
      return await getSearchedBlogs(searchedText);
    },
    ...options,
  });

export const useEditBlog = (): UseMutationResult<void, Error, { blog: Blog; newImg: File | null }> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [BLOG_MUTATION, EDIT_BLOG],
    mutationFn: async ({ blog, newImg }) => {
      return await editBlog(blog, newImg);
    },
    onSettled: (_, __, { blog }) => {
      queryClient.invalidateQueries({ queryKey: [BLOG_IMAGE_QUERY, blog.id], refetchType: 'all' });
      queryClient.invalidateQueries({ queryKey: [BLOGS_QUERY] });
    },
  });
};

export const useGetBlogByIdQuery = (blogId: number): UseQueryResult<Blog | null, Error> =>
  useQuery({
    queryKey: [GET_BLOG_BY_ID],
    queryFn: async () => {
      return await getBlogById(blogId);
    },
  });
