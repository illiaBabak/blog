import { JSX, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeleteComment, useEditComment } from 'src/api/comments';
import { useGetCurrentUserQuery, useGetUserByIdQuery } from 'src/api/user';
import { SkeletonLoader } from 'src/components/SkeletonLoader';
import { pageConfig } from 'src/config/pages';
import { CommentType } from 'src/types/types';
import { formatDate } from 'src/utils/formatDate';

type Props = {
  comment: CommentType;
  blogId: number;
};

export const Comment = ({ comment, blogId }: Props): JSX.Element => {
  const navigate = useNavigate();

  const [isEdit, setIsEdit] = useState(false);

  const [commentText, setCommentText] = useState(comment.text);

  const { data: currentUser } = useGetCurrentUserQuery();

  const { data: user, isLoading: isLoadingUserImg } = useGetUserByIdQuery(comment.user_id, {
    enabled: !!comment.user_id,
  });

  const { mutateAsync: deleteComment } = useDeleteComment();

  const { mutateAsync: editComment } = useEditComment();

  const isUserComment = currentUser?.id === user?.user_id;

  return (
    <div className='d-flex flex-row align-items-center comment rounded p-4 m-2 mx-3 position-relative'>
      <div
        onClick={() => navigate(`${pageConfig.profile}?userId=${user?.user_id}`)}
        className='d-flex flex-row align-items-center user-data'
      >
        {isLoadingUserImg ? (
          <SkeletonLoader />
        ) : (
          <img
            className='object-fit-cover rounded-circle user-icon'
            src={user?.image_url ?? 'empty-pfp.png'}
            alt='user-icon'
            onError={({ currentTarget }) => {
              currentTarget.src = '/empty-pfp.png';
              currentTarget.onerror = null; //stop looping
            }}
          />
        )}
        <p className='mb-0 ms-2'>{user?.username}</p>
      </div>

      <div className='info ms-4 w-100 h-100'>
        {isEdit ? (
          <input
            value={commentText}
            onChange={({ currentTarget: { value } }) => setCommentText(value)}
            className='w-100 comment-input mt-1'
            type='text'
          />
        ) : (
          <p className='mb-0 mt-1'>{comment.text}</p>
        )}

        <p className='mb-0 mt-2 date'>{formatDate(comment.created_at)}</p>
      </div>

      {isUserComment && (
        <img
          onClick={() => {
            setIsEdit((prev) => !prev);

            if (isEdit && comment.text !== commentText)
              editComment({ commentId: comment.id, blogId, newComment: commentText });
          }}
          className='object-fit-cover edit-btn position-absolute m-1'
          src={isEdit ? '/success.png' : '/edit.png'}
          alt='edit-icon'
        />
      )}

      {isUserComment && (
        <div
          className='position-absolute delete-btn d-flex justify-content-center align-items-center'
          onClick={(e) => {
            e.stopPropagation();

            deleteComment({ commentId: comment.id, blogId });
          }}
        >
          x
        </div>
      )}
    </div>
  );
};
