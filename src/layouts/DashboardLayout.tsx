import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { CommandPalette } from './CommandPalette';
import { NotificationPanel } from './NotificationPanel';
import { MobileNav } from './MobileNav';
import { useSidebarStore } from '@/store/sidebar.store';
import { useUIStore } from '@/store/ui.store';

export function DashboardLayout() {
  const location = useLocation();
  const { isCollapsed, isMobileOpen, closeMobile } = useSidebarStore();
  const {
    isCommandPaletteOpen,
    setCommandPaletteOpen,
    isNotificationPanelOpen,
    setNotificationPanelOpen,
  } = useUIStore();

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar — hidden on mobile, shown on lg+ */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile slide-over sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={closeMobile}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 z-50 lg:hidden"
            >
              <Sidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <motion.div
        initial={false}
        animate={{ marginLeft: typeof window !== 'undefined' && window.innerWidth >= 1024 ? (isCollapsed ? 72 : 260) : 0 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="min-h-screen flex flex-col"
      >
        <Navbar
          onSearchClick={() => setCommandPaletteOpen(true)}
          onNotificationClick={() => setNotificationPanelOpen(true)}
        />

        <main className="flex-1 p-4 lg:p-6 pb-20 lg:pb-6" role="main">
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
      </motion.div>

      {/* Mobile bottom nav */}
      <MobileNav />

      {/* Overlays */}
      <CommandPalette open={isCommandPaletteOpen} onOpenChange={setCommandPaletteOpen} />
      <NotificationPanel open={isNotificationPanelOpen} onClose={() => setNotificationPanelOpen(false)} />
    </div>
  );
}
