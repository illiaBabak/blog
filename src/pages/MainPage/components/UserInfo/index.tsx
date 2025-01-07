import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetUserImageQuery, useGetUserQuery, useSignOut, useUpdateUserMetadata, useUploadImage } from 'src/api/user';
import { SkeletonLoader } from 'src/components/SkeletonLoader';
import { pageConfig } from 'src/config/pages';
import { urlToFile } from 'src/utils/urlToFile';

export const UserInfo = (): JSX.Element => {
  const navigate = useNavigate();

  const { data: user, isLoading: isLoadingUser } = useGetUserQuery();

  const { data: userImg, isLoading: isLoadingUserImg } = useGetUserImageQuery(user?.email?.split('@')[0] ?? ''); // key of user image is local part of email

  const { mutateAsync: uploadImg } = useUploadImage();

  const { mutateAsync: updateUser } = useUpdateUserMetadata();

  const { mutateAsync: signOut } = useSignOut();

  const handleSignOut = () => {
    signOut();
    navigate(pageConfig.start);
  };

  useEffect(() => {
    if (user?.app_metadata.provider === 'google' && user.email && !user.user_metadata.username) {
      const uploadDataUser = async () => {
        const userImgFile = await urlToFile(user.user_metadata.avatar_url as string, 'image.jpg');

        uploadImg({ email: (user.email as string).split('@')[0], file: userImgFile });
        updateUser({ username: (user.email as string).split('@')[0] });
      };
      uploadDataUser();
    }
  }, [user, uploadImg, updateUser]);

  return (
    <div className='d-flex flex-column align-items-center user-info rounded'>
      <img
        className='user-icon mt-4 rounded-circle'
        src={isLoadingUser || isLoadingUserImg ? '/empty-pfp.png' : userImg}
        alt='user-icon'
      />

      {isLoadingUser ? <SkeletonLoader /> : <h4 className='m-0 username'>{user?.user_metadata.username}</h4>}

      <div className='d-flex flex-column mt-4 text-center text-white'>
        <div className='user-btn p-1 rounded'>My profile</div>
        <div className='user-btn p-1 mt-2 rounded' onClick={handleSignOut}>
          Logout
        </div>
      </div>
    </div>
  );
};
