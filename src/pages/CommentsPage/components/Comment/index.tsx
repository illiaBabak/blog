import { JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetUserByIdQuery } from 'src/api/user';
import { SkeletonLoader } from 'src/components/SkeletonLoader';
import { pageConfig } from 'src/config/pages';
import { CommentType } from 'src/types/types';
import { formatDate } from 'src/utils/formatDate';

type Props = {
  comment: CommentType;
};

export const Comment = ({ comment }: Props): JSX.Element => {
  const navigate = useNavigate();

  const { data: user, isLoading: isLoadingUserImg } = useGetUserByIdQuery(comment.user_id, {
    enabled: !!comment.user_id,
  });

  return (
    <div className='d-flex flex-row align-items-center comment rounded p-4 m-2 mx-3'>
      <div
        onClick={() => navigate(`${pageConfig.profile}?userId=${user?.user_id}`)}
        className='d-flex flex-row align-items-center user-data'
      >
        {isLoadingUserImg ? (
          <SkeletonLoader />
        ) : (
          <img
            className='object-fit-cover rounded-circle user-icon'
            src={user?.image_url ?? '/empty-pfp.png'}
            alt='user-icon'
          />
        )}
        <p className='mb-0 ms-2'>{user?.username}</p>
      </div>

      <div className='info ms-4 h-100'>
        <p className='mb-0'>{comment.text}</p>
        <p className='mb-0 mt-2 date'>{formatDate(comment.created_at)}</p>
      </div>
    </div>
  );
};
