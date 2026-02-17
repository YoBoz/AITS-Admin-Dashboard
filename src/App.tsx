import { RouterProvider } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/Tooltip';
import { AppProviders } from '@/providers';
import { router } from '@/routes';

function App() {
  return (
    <AppProviders>
      <TooltipProvider delayDuration={200}>
        <RouterProvider router={router} />
      </TooltipProvider>
    </AppProviders>
  );
}

export default App;
