import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Store } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/animations';

export default function MerchantUnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="max-w-md w-full text-center space-y-6"
      >
        {/* Shield icon */}
        <div className="mx-auto w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center">
          <ShieldAlert className="w-10 h-10 text-amber-600 dark:text-amber-400" />
        </div>

        <h1 className="text-6xl font-extrabold font-montserrat text-amber-600 dark:text-amber-400">
          403
        </h1>

        <div>
          <h2 className="text-2xl font-bold font-montserrat mb-2">Permission Required</h2>
          <p className="text-muted-foreground">
            Your current role does not have access to this section.
            Please contact your store manager or switch roles if available.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate('/merchant/orders')}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#BE052E] text-white font-medium text-sm hover:bg-[#a00425] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </button>
          <button
            onClick={() => navigate('/merchant/login')}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-border text-foreground font-medium text-sm hover:bg-muted transition-colors"
          >
            <Store className="w-4 h-4" />
            Switch Account
          </button>
        </div>
      </motion.div>
    </div>
  );
}
