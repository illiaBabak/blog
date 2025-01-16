import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetUserImageQuery, useGetUserQuery, useSignOut, useUpdateUserPublicData } from 'src/api/user';
import { SkeletonLoader } from 'src/components/SkeletonLoader';
import { pageConfig } from 'src/config/pages';
import { isString } from 'src/utils/guards';

export const UserInfo = (): JSX.Element => {
  const navigate = useNavigate();

  const [isDataUpdated, setIsDataUpdated] = useState(false);

  const { data: user, isLoading: isLoadingUser } = useGetUserQuery();

  const { data: userImg, isLoading: isLoadingUserImg } = useGetUserImageQuery(user?.id ?? '', { enabled: !!user?.id }); // key of user image is local part of email

  const { mutateAsync: updateUserData } = useUpdateUserPublicData();

  const { mutateAsync: signOut } = useSignOut();

  const handleSignOut = () => {
    signOut();
    navigate(pageConfig.start);
  };

  const redirectToMyProfile = () => navigate(pageConfig.profile);

  const userCreatedDate = new Date(user?.created_at ?? '').getTime();

  const differenceBtwDates = new Date(Date.now() - userCreatedDate).getSeconds(); // handle first sign in using google auth

  useEffect(() => {
    if (!user || user?.app_metadata.provider !== 'google' || isDataUpdated || differenceBtwDates > 1) return;

    const updateUser = async () => {
      try {
        await updateUserData({
          userId: user.id,
          username: isString(user?.user_metadata.username)
            ? user.user_metadata.username
            : (user?.email as string).split('@')[0],
          email: user?.email ?? '',
          imageUrl: user?.user_metadata.picture as string,
        });

        setIsDataUpdated(true);
      } catch {
        throw new Error('Failed to update user data');
      }
    };

    updateUser();
  }, [user, updateUserData, isDataUpdated, setIsDataUpdated, differenceBtwDates]);

  return (
    <div className='d-flex flex-column align-items-center user-info rounded'>
      <img
        className='user-icon mt-4 rounded-circle'
        src={isLoadingUser || isLoadingUserImg || !userImg ? '/empty-pfp.png' : userImg}
        onError={({ currentTarget }) => {
          currentTarget.src = '/empty-pfp.png';
          currentTarget.onerror = null; //stop looping
        }}
        alt='user-icon'
      />

      {isLoadingUser ? <SkeletonLoader /> : <h4 className='m-0 username'>{user?.user_metadata.username}</h4>}

      <div className='d-flex flex-column mt-4 text-center text-white'>
        <div className='user-btn p-1 rounded' onClick={redirectToMyProfile}>
          My profile
        </div>
        <div className='user-btn p-1 mt-2 rounded' onClick={handleSignOut}>
          Logout
        </div>
      </div>
    </div>
  );
};
