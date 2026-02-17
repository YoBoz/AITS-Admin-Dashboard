import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/animations';

export default function UnauthorizedPage() {
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

        <h1 className="text-6xl font-extrabold font-[Montserrat] text-amber-600 dark:text-amber-400">403</h1>

        <div>
          <h2 className="text-2xl font-bold font-[Montserrat] mb-2">Access Restricted</h2>
          <p className="text-muted-foreground">
            You don&apos;t have the required permissions to access this page.
            Please contact your administrator if you believe this is an error.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#BE052E] text-white font-medium text-sm hover:bg-[#a00425] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          <a
            href="mailto:admin@aits.airport"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-border text-foreground font-medium text-sm hover:bg-muted transition-colors"
          >
            <Mail className="w-4 h-4" />
            Contact Admin
          </a>
        </div>
      </motion.div>
    </div>
  );
}
