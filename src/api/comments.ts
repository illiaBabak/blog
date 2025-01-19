import { useMutation, UseMutationResult, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { supabase } from 'src';
import { CommentType } from 'src/types/types';
import { COMMENT_MUTATION, CREATE_COMMENT, GET_COMMENTS } from './constants';

const getComments = async (blogId: number): Promise<CommentType[]> => {
  const { data, error } = await supabase
    .from('comments')
    .select()
    .eq('blog_id', blogId)
    .order('created_at', { ascending: false });

  if (error) throw new Error('Something went wrong with getting comments!');

  return data ?? [];
};

const createComment = async (comment: string, blogId: number, userId: string): Promise<void> => {
  const { error } = await supabase.from('comments').insert({ text: comment, blog_id: blogId, user_id: userId });

  if (error) throw new Error('Something went wrong with creating comment!');
};

export const useGetCommentsQuery = (blogId: number): UseQueryResult<CommentType[], Error> =>
  useQuery({
    queryKey: [GET_COMMENTS, blogId],
    queryFn: async () => {
      return await getComments(blogId);
    },
  });

export const useAddComment = (): UseMutationResult<
  void,
  Error,
  { comment: string; blogId: number; userId: string }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [COMMENT_MUTATION, CREATE_COMMENT],
    mutationFn: async ({ comment, blogId, userId }) => {
      return await createComment(comment, blogId, userId);
    },
    onSettled: async (_, __, { blogId }) => {
      await queryClient.invalidateQueries({ queryKey: [GET_COMMENTS, blogId] });
    },
  });
};
