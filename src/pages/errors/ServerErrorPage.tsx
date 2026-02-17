import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, RefreshCw, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/animations';

const RETRY_SECONDS = 30;

export default function ServerErrorPage() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(RETRY_SECONDS);

  const retry = useCallback(() => {
    window.location.reload();
  }, []);

  useEffect(() => {
    if (countdown <= 0) {
      retry();
      return;
    }
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown, retry]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="max-w-md w-full text-center space-y-6"
      >
        {/* Warning icon */}
        <div className="mx-auto w-20 h-20 rounded-full bg-red-100 dark:bg-red-950/40 flex items-center justify-center">
          <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
        </div>

        <h1 className="text-6xl font-extrabold font-[Montserrat] text-red-600 dark:text-red-400">500</h1>

        <div>
          <h2 className="text-2xl font-bold font-[Montserrat] mb-2">Service Unavailable</h2>
          <p className="text-muted-foreground">
            We&apos;re experiencing technical difficulties. The page will automatically retry.
          </p>
        </div>

        {/* Countdown */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm font-medium">
          <RefreshCw className="w-4 h-4 animate-spin" />
          Retrying in {countdown}s
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={retry}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#BE052E] text-white font-medium text-sm hover:bg-[#a00425] transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Retry Now
          </button>
          <button
            onClick={() => navigate('/dashboard/overview')}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-border text-foreground font-medium text-sm hover:bg-muted transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            Report Issue
          </button>
        </div>
      </motion.div>
    </div>
  );
}
