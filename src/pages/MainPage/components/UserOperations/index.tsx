export const UserOperations = (): JSX.Element => {
  return (
    <div className='user-operations mt-4 p-3 rounded text-center'>
      <p>Select an action below to manage your blogs:</p>
      <div className='operation rounded w-100 d-flex justify-content-center align-items-center mt-3 text-white'>
        See my blogs
      </div>
      <div className='operation rounded w-100 d-flex justify-content-center align-items-center mt-3 text-white'>
        Create new blog
      </div>
      <div className='operation rounded w-100 d-flex justify-content-center align-items-center mt-3 text-white'>
        Edit blog
      </div>
      <div className='operation rounded w-100 d-flex justify-content-center align-items-center mt-3 text-white'>
        Delete blog
      </div>
    </div>
  );
};
