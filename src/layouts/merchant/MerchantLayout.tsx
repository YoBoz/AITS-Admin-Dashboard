import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MerchantSidebar } from './MerchantSidebar';
import { MerchantTopbar } from './MerchantTopbar';
import { NotificationPanel } from '@/layouts/NotificationPanel';
import { useMerchantAuth } from '@/hooks/useMerchantAuth';
import { useState } from 'react';

export function MerchantLayout() {
  const location = useLocation();
  const { isAuthenticated } = useMerchantAuth();
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isNotificationOpen, setNotificationOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/merchant/login" state={{ from: location.pathname }} replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <MerchantSidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 z-50 lg:hidden"
            >
              <MerchantSidebar isCollapsed={false} onToggle={() => {}} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content — use CSS transition instead of motion.div to avoid
          creating a containing block (transform) that breaks fixed-position modals */}
      <div
        style={{
          marginLeft:
            typeof window !== 'undefined' && window.innerWidth >= 1024
              ? isCollapsed ? 72 : 260
              : 0,
          transition: 'margin-left 0.25s ease-in-out',
        }}
        className="min-h-screen flex flex-col"
      >
        <MerchantTopbar
          onMenuClick={() => setMobileSidebarOpen(true)}
          onNotificationClick={() => setNotificationOpen(true)}
        />

        <NotificationPanel
          open={isNotificationOpen}
          onClose={() => setNotificationOpen(false)}
          variant="merchant"
        />

        <main className="flex-1 p-4 lg:p-6 pb-20 lg:pb-6" role="main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
