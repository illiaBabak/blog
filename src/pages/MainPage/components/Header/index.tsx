import { useGetUserImageQuery, useGetUserQuery } from 'src/api/user';
import { ThemeBtn } from 'src/components/ThemeBtn';

export const Header = (): JSX.Element => {
  const { data: user } = useGetUserQuery();

  const { data: image } = useGetUserImageQuery(user?.email?.split('@')[0] ?? '');

  return (
    <div className='header w-100 d-flex flex-row align-items-center justify-content-between px-4 py-1'>
      <h3 className='m-0 title'>Blog</h3>
      <div className='d-flex flex-row align-items-center'>
        <p className='m-0 me-3'>{user?.user_metadata.username}</p>
        <img
          onError={({ currentTarget }) => (currentTarget.src = '/empty-pfp.png')}
          className='object-fit-contain user-icon rounded-circle me-4'
          src={image ? image : '/empty-pfp.png'}
          alt='icon'
        />
        <ThemeBtn />
      </div>
    </div>
  );
};
