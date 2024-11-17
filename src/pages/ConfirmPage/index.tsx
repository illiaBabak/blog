import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from 'src/root';

export const Confirm = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const confirmUser = async () => {
      const token = searchParams.get('token');

      if (token) {
        await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'email',
        });

        const channel = new BroadcastChannel('auth_channel');
        channel.postMessage({ type: 'VERIFIED' });
        channel.close();
      }
    };

    confirmUser();
  }, [searchParams]);

  return (
    <div className='confirm-page w-100 h-100 d-flex justify-content-center align-items-center flex-column'>
      <h1 className='fw-bolder title'>Blog</h1>
      <div className='confirm p-2 text-center rounded m-2 text-white'>Now you can close this page!</div>
    </div>
  );
};
