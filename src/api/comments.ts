import { useMutation, UseMutationResult, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { supabase } from 'src';
import { CommentType } from 'src/types/types';
import { COMMENT_MUTATION, CREATE_COMMENT, DELETE_COMMENT, EDIT_COMMENT, GET_COMMENTS } from './constants';

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

const deleteComment = async (commentId: number): Promise<void> => {
  const { error } = await supabase.from('comments').delete().eq('id', commentId);

  if (error) throw new Error('Something went wrong with deleting comment!');
};

const editComment = async (newComment: string, commentId: number): Promise<void> => {
  const { error } = await supabase.from('comments').update({ text: newComment }).eq('id', commentId);

  if (error) throw new Error('Something went wrong with editing comment!');
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

export const useDeleteComment = (): UseMutationResult<void, Error, { commentId: number; blogId: number }> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [COMMENT_MUTATION, DELETE_COMMENT],
    mutationFn: async ({ commentId }) => {
      return await deleteComment(commentId);
    },
    onSettled: async (_, __, { blogId }) => {
      await queryClient.invalidateQueries({ queryKey: [GET_COMMENTS, blogId] });
    },
  });
};

export const useEditComment = (): UseMutationResult<
  void,
  Error,
  { commentId: number; blogId: number; newComment: string }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [COMMENT_MUTATION, EDIT_COMMENT],
    mutationFn: async ({ newComment, commentId }) => {
      return await editComment(newComment, commentId);
    },
    onSettled: async (_, __, { blogId }) => {
      await queryClient.invalidateQueries({ queryKey: [GET_COMMENTS, blogId] });
    },
  });
};
