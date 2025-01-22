import { useGetUserBlogsQuery } from 'src/api/blogs';
import {
  useGetCurrentUserImageQuery,
  useGetCurrentUserQuery,
  useGetUserByIdQuery,
  useUpdateUserPublicInfo,
  useUploadUserImage,
} from 'src/api/user';
import { SkeletonLoader } from 'src/components/SkeletonLoader';
import { BlogsList } from 'src/components/BlogsList';
import { Blog } from 'src/types/types';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { pageConfig } from 'src/config/pages';
import { JSX, useState } from 'react';
import { WindowWrapper } from 'src/components/WindowWrapper';
import { FormField } from 'src/components/FormField';
import { SUPABASE_URL } from 'src/utils/constants';
import { ThemeBtn } from 'src/components/ThemeBtn';

export const ProfilePage = (): JSX.Element => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const userId = searchParams.get('userId') ?? '';

  if (!userId) navigate(pageConfig.redirect);

  const { data: ownUser } = useGetCurrentUserQuery();

  const { data: user, isLoading: isLoadingUser } = useGetUserByIdQuery(userId);

  const { data: userImg, isLoading: isLoadingUserImg } = useGetCurrentUserImageQuery(userId, {
    enabled: !!userId,
  });

  const { data: userBlogs, isLoading: isLoadingUserBlogs } = useGetUserBlogsQuery(userId);

  const { mutateAsync: updateUserPublicData } = useUpdateUserPublicInfo();

  const { mutateAsync: uploadUserImage } = useUploadUserImage();

  const [isEdit, setIsEdit] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPfp, setNewPfp] = useState<File | null>(null);

  const isOwnUser = ownUser?.id === userId;

  const handleSave = () => {
    if (!userId) return;

    if (newPfp) {
      uploadUserImage({
        userId,
        email: user?.email as string,
        file: newPfp,
      });
    }

    updateUserPublicData({
      email: user?.email as string,
      username: newUsername ? newUsername : (user?.username as string),
      userId,
      imageUrl: `${SUPABASE_URL}/storage/v1/object/public/images/pfp/${user?.email}?t=${Date.now()}`,
    });

    setNewUsername('');
    setIsEdit(false);
  };

  return (
    <div className='d-flex flex-column profile-page h-100'>
      {isEdit && (
        <WindowWrapper onClose={() => setIsEdit(false)}>
          <div
            className='edit-window position-relative d-flex flex-column align-items-center'
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className='mt-3'>Edit your profile!</h2>
            <div
              className='close-btn d-flex justify-content-center align-items-center position-absolute mt-1 me-1 fs-3'
              onClick={() => setIsEdit(false)}
            >
              x
            </div>
            <div className='input-file-wrapper position-relative mt-4'>
              <img
                className='new-pfp object-fit-cover'
                src={newPfp ? URL.createObjectURL(newPfp) : (userImg ?? '/empty-pfp.png')}
                alt='user-pfp'
                onError={({ currentTarget }) => {
                  currentTarget.src = '/empty-pfp.png';
                  currentTarget.onerror = null;
                }}
              />
              <input
                className='input-file position-absolute'
                type='file'
                onChange={({ currentTarget: { files } }) => {
                  if (!files) return;

                  const img = files[0];

                  setNewPfp(img);
                }}
              />
            </div>
            <p className='mt-3'>Upload your new profile image!</p>
            <div className='w-75'>
              <FormField
                fieldName='New username'
                inputVal={newUsername}
                onChange={({ currentTarget: { value } }) => setNewUsername(value)}
                type='text'
              />
            </div>

            <div
              onClick={() => handleSave()}
              className={`btn mt-4 p-2 text-white d-flex justify-content-center align-items-center ${newUsername || newPfp ? '' : 'disabled'}`}
            >
              Save
            </div>
          </div>
        </WindowWrapper>
      )}
      <div className='d-flex user-content align-items-center px-3 w-100 position-relative'>
        <div className='d-flex btn-container flex-row align-items-center position-absolute'>
          <div
            onClick={() => navigate(pageConfig.main)}
            className='btn mt-3 me-3 p-2 text-white d-flex justify-content-center align-items-center'
          >
            &lt; Back
          </div>
          <ThemeBtn />
        </div>

        {isLoadingUserImg || !userImg ? (
          <SkeletonLoader />
        ) : (
          <img
            className='user-icon object-fit-cover'
            src={userImg}
            alt='user-icon'
            onError={({ currentTarget }) => {
              currentTarget.src = '/empty-pfp.png';
              currentTarget.onerror = null; //stop looping
            }}
          />
        )}
        <div className='d-flex flex-column user-info w-100 justify-content-between ms-2'>
          <div className='user-info-text'>
            {isLoadingUser ? <SkeletonLoader /> : <p className='m-0 username'>{user?.username}</p>}
            {isLoadingUser ? <SkeletonLoader /> : <p className='m-0'>Email: {user?.email}</p>}
          </div>

          {isOwnUser && (
            <div
              className='btn p-2 text-white d-flex justify-content-center align-items-center'
              onClick={() => setIsEdit(true)}
            >
              Edit info
            </div>
          )}
        </div>
      </div>
      <div className='d-flex flex-row w-100 h-100 blogs-container scroll-container-y'>
        {!isLoadingUserBlogs && !userBlogs?.length && (
          <div className='d-flex w-100 h-100 flex-column justify-content-center align-items-center mb-4'>
            <p className='fs-2 mb-4'>No blogs found :(</p>
          </div>
        )}
        {(isLoadingUserBlogs || !!userBlogs?.length) && (
          <BlogsList actionType={{ type: 'comments' }} blogs={userBlogs as Blog[]} isLoading={isLoadingUserBlogs} />
        )}
      </div>
    </div>
  );
};
