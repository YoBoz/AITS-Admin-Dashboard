import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/animations';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="max-w-lg w-full text-center space-y-6"
      >
        {/* Airport gate illustration */}
        <div className="mx-auto w-56 h-36 relative">
          <svg viewBox="0 0 220 140" fill="none" className="w-full h-full" aria-hidden="true">
            {/* Gate frame */}
            <rect x="20" y="20" width="180" height="100" rx="8" className="stroke-muted-foreground/30" strokeWidth="2" fill="none" />
            {/* Gate opening */}
            <rect x="60" y="40" width="100" height="80" rx="4" className="fill-muted/50" />
            {/* Gate sign */}
            <rect x="50" y="5" width="120" height="24" rx="4" fill="#BE052E" />
            <text x="110" y="22" textAnchor="middle" className="fill-white" fontSize="11" fontWeight="bold" fontFamily="Montserrat">
              GATE 404
            </text>
            {/* Window dots */}
            <circle cx="40" cy="50" r="4" className="fill-muted-foreground/20" />
            <circle cx="40" cy="70" r="4" className="fill-muted-foreground/20" />
            <circle cx="180" cy="50" r="4" className="fill-muted-foreground/20" />
            <circle cx="180" cy="70" r="4" className="fill-muted-foreground/20" />
            {/* Plane silhouette */}
            <path d="M85 70 L110 60 L135 70 L125 72 L110 65 L95 72 Z" className="fill-muted-foreground/20" />
            <rect x="106" y="58" width="8" height="20" rx="2" className="fill-muted-foreground/15" />
          </svg>
        </div>

        {/* 404 */}
        <h1 className="text-7xl font-extrabold font-[Montserrat] text-[#BE052E]">404</h1>

        <div>
          <h2 className="text-2xl font-bold font-[Montserrat] mb-2">Page Not Found</h2>
          <p className="text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or has been moved to a different gate.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate('/dashboard/overview')}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#BE052E] text-white font-medium text-sm hover:bg-[#a00425] transition-colors"
          >
            <Home className="w-4 h-4" />
            Go to Overview
          </button>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-border text-foreground font-medium text-sm hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
}
