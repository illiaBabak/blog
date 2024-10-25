import { createClient } from '@supabase/supabase-js';
import { BlogsList } from 'src/components/BlogsList';
import { Header } from 'src/components/Header';
import { Database } from 'src/types/supabase';
import { SUPABASE_URL } from 'src/utils/constants';

export const supabase = createClient<Database>(SUPABASE_URL, import.meta.env.ENV_API_KEY);

export const App = (): JSX.Element => {
  return (
    <div className='d-flex flex-column'>
      <Header />
      <BlogsList />
    </div>
  );
};
