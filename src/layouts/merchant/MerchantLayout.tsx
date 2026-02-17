import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MerchantSidebar } from './MerchantSidebar';
import { MerchantNavbar } from './MerchantNavbar';
import { useMerchantAuth } from '@/hooks/useMerchantAuth';
import { useOrderPolling } from '@/hooks/useOrderPolling';

export function MerchantLayout() {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useMerchantAuth();

  // Start order polling when authenticated
  useOrderPolling();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/merchant/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar — 240px */}
      <div className="hidden lg:block">
        <MerchantSidebar />
      </div>

      {/* Main content — offset by sidebar width */}
      <div className="lg:ml-[240px] min-h-screen flex flex-col transition-[margin] duration-250 ease-in-out">
        <MerchantNavbar />

        <main className="flex-1 p-4 lg:p-6" role="main">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
