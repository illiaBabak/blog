import { User } from '@supabase/supabase-js';
import { JSX, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetCurrentUserImageQuery, useSignOut, useUpdateUserPublicInfo } from 'src/api/user';
import { SkeletonLoader } from 'src/components/SkeletonLoader';
import { pageConfig } from 'src/config/pages';
import { useGetDeviceType } from 'src/hooks/useGetDeviceType';
import { isString } from 'src/utils/guards';

type Props = {
  user: User | null | undefined;
  isLoadingUser: boolean;
};

export const UserInfo = ({ user, isLoadingUser }: Props): JSX.Element => {
  const navigate = useNavigate();

  const [isDataUpdated, setIsDataUpdated] = useState(false);

  const { data: userImg, isLoading: isLoadingUserImg } = useGetCurrentUserImageQuery(user?.id ?? '', {
    enabled: !!user?.id,
  }); // key of user image is local part of email

  const { mutateAsync: updateUserInfo } = useUpdateUserPublicInfo();

  const { mutateAsync: signOut } = useSignOut();

  const handleSignOut = () => {
    signOut();
    navigate(pageConfig.start);
  };

  const redirectToProfile = () => navigate(`${pageConfig.profile}?userId=${user?.id}`);

  const userCreatedDate = new Date(user?.created_at ?? '').getTime();

  const differenceBtwDates = new Date(Date.now() - userCreatedDate).getSeconds(); // handle first sign in using google auth

  const { isMobile } = useGetDeviceType();

  useEffect(() => {
    if (!user || user?.app_metadata.provider !== 'google' || isDataUpdated || differenceBtwDates > 2) return;

    const updateUser = async () => {
      try {
        const username = isString(user?.user_metadata.username)
          ? user.user_metadata.username
          : (user?.email as string).split('@')[0];

        await updateUserInfo({
          userId: user.id,
          username,
          email: user?.email as string,
          imageUrl: user?.user_metadata.picture as string,
        });

        setIsDataUpdated(true);
      } catch {
        throw new Error('Failed to update user data');
      }
    };

    updateUser();
  }, [user, updateUserInfo, isDataUpdated, setIsDataUpdated, differenceBtwDates]);

  return (
    <div
      className={`d-flex ${isMobile ? 'flex-row px-3 w-100 justify-content-between' : 'flex-column'} align-items-center user-info rounded`}
    >
      <div className='d-flex align-items-center flex-column justify-content-center text-center'>
        <img
          className={`user-icon ${isMobile ? 'm-0' : 'mt-4'} rounded-circle`}
          src={isLoadingUser || isLoadingUserImg || !userImg ? '/empty-pfp.png' : userImg}
          onError={({ currentTarget }) => {
            currentTarget.src = '/empty-pfp.png';
            currentTarget.onerror = null; //stop looping
          }}
          alt='user-icon'
        />

        {isLoadingUser ? <SkeletonLoader /> : <h5 className='m-0 username'>{user?.user_metadata.username}</h5>}
      </div>

      <div className={`d-flex ${isMobile ? 'ms-3 flex-row' : 'mt-4 flex-column'} text-center text-white`}>
        <div
          className='user-btn p-1 rounded d-flex justify-content-center align-items-center'
          onClick={redirectToProfile}
        >
          My profile
        </div>
        <div
          className={`user-btn p-1 ${isMobile ? 'ms-2' : 'mt-2'} rounded d-flex justify-content-center align-items-center`}
          onClick={handleSignOut}
        >
          Logout
        </div>
      </div>
    </div>
  );
};
