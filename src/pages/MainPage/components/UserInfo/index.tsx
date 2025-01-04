import { useEffect } from 'react';
import { useGetUserImageQuery, useGetUserQuery, useUpdateUserMetadata, useUploadImage } from 'src/api/user';
import { urlToFile } from 'src/utils/urlToFile';

export const UserInfo = (): JSX.Element => {
  const { data: user } = useGetUserQuery();

  const { data: userImg, isLoading: isLoadingUserImg } = useGetUserImageQuery(user?.email?.split('@')[0] ?? ''); // key of user image is local part of email

  const { mutateAsync: uploadImg } = useUploadImage();

  const { mutateAsync: updateUser } = useUpdateUserMetadata();

  useEffect(() => {
    if (user?.app_metadata.provider === 'google' && user.email) {
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
        src={isLoadingUserImg ? '/empty-pfp.png' : userImg}
        alt='user-icon'
      />

      <h4 className='mt-2'>{user?.user_metadata.username}</h4>

      <div className='d-flex flex-column mt-4 text-center text-white'>
        <div className='user-btn p-1 rounded'>Edit your profile</div>
        <div className='user-btn p-1 mt-2 rounded'>Logout</div>
      </div>
    </div>
  );
};
