import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/Tooltip';
import { AppProviders } from '@/providers';
import { router } from '@/routes';

function App() {
  return (
    <AppProviders>
      <TooltipProvider delayDuration={200}>
        <RouterProvider router={router} />
        <Toaster position="top-right" richColors closeButton duration={3000} />
      </TooltipProvider>
    </AppProviders>
  );
}

export default App;
