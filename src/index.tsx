import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './root';
import './index.scss';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL } from './utils/constants';
import { Database } from './types/supabase';

export const supabase = createClient<Database>(
  SUPABASE_URL,
  import.meta.env.ENV_API_KEY
);

const rootEl = document.getElementById('root');
const queryClient = new QueryClient();

if (rootEl) {
  createRoot(rootEl).render(
    <QueryClientProvider client={queryClient}>
      <StrictMode>
        <App />
      </StrictMode>
    </QueryClientProvider>
  );
} else
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file."
  );
