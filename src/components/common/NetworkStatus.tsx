import { useEffect, useState } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '@/store/ui.store';
import { toast } from 'sonner';

export function NetworkStatus() {
  const { isOffline, setOffline } = useUIStore();
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setOffline(false);
      if (wasOffline) {
        toast.success('Connection restored', {
          icon: <Wifi className="w-4 h-4 text-green-500" />,
        });
      }
    };

    const handleOffline = () => {
      setOffline(true);
      setWasOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setOffline, wasOffline]);

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-amber-500 text-amber-950 overflow-hidden z-50"
        >
          <div className="flex items-center justify-center gap-2 py-2 px-4 text-sm font-medium">
            <WifiOff className="w-4 h-4" />
            <span>You are currently offline. Some features may be unavailable.</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
