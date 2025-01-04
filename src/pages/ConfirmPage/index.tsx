import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from 'src';
import { ThemeBtn } from 'src/components/ThemeBtn';

export const Confirm = (): JSX.Element => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const confirmUser = async () => {
      const token = searchParams.get('token');

      if (!token) return;

      const channel = new BroadcastChannel('auth_channel');
      channel.postMessage({ type: 'VERIFIED' });

      await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'email',
      });
    };

    confirmUser();
  }, [searchParams]);

  return (
    <div className='confirm-page w-100 h-100 d-flex flex-column p-2'>
      <ThemeBtn />
      <div className='m-auto d-flex justify-content-center align-items-center flex-column'>
        <h1 className='fw-bolder title'>Blog</h1>
        <div className='confirm p-2 text-center rounded m-2 text-white'>Now you can close this page!</div>
      </div>
    </div>
  );
};
