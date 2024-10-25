import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './root';
import './index.scss';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const container = document.getElementById('root');
const queryClient = new QueryClient();

if (container) {
  createRoot(container).render(
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
