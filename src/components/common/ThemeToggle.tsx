import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/Button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/Tooltip';

// Custom Eclipse icon - half sun, half moon
function EclipseIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Sun half (left) */}
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="M4.93 4.93l1.41 1.41" />
      <path d="M4.93 19.07l1.41-1.41" />
      <path d="M2 12h2" />
      {/* Half circle - sun side */}
      <path d="M12 6a6 6 0 0 0 0 12" />
      {/* Moon half (right) - filled */}
      <path d="M12 6a6 6 0 0 1 0 12" fill="currentColor" />
    </svg>
  );
}

// Custom Tron light cycle icon
function TronCycleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ filter: 'drop-shadow(0 0 2px currentColor)' }}
    >
      {/* Light cycle silhouette */}
      <circle cx="5" cy="17" r="3" />
      <circle cx="19" cy="17" r="3" />
      <path d="M5 14h4l3-5h5l2 5" />
      <path d="M9 14l2-3" />
      {/* Light trail */}
      <path d="M2 17h1" strokeWidth="3" />
    </svg>
  );
}

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const getTooltipText = () => {
    switch (theme) {
      case 'eclipse':
        return 'Eclipse mode (Ctrl+D to toggle light/dark)';
      case 'tron':
        return 'Tron mode (Ctrl+D to toggle light/dark)';
      case 'dark':
        return 'Switch to light mode';
      default:
        return 'Switch to dark mode';
    }
  };

  const renderIcon = () => {
    switch (theme) {
      case 'eclipse':
        return <EclipseIcon className="h-4 w-4 text-violet-400" />;
      case 'tron':
        return <TronCycleIcon className="h-4 w-4 text-[#00FF66]" />;
      case 'dark':
        return <Sun className="h-4 w-4" />;
      default:
        return <Moon className="h-4 w-4" />;
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="relative h-9 w-9"
        >
          <motion.div
            key={theme}
            initial={{ scale: 0.8, opacity: 0, rotate: -30 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.8, opacity: 0, rotate: 30 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {renderIcon()}
          </motion.div>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{getTooltipText()}</p>
      </TooltipContent>
    </Tooltip>
  );
}
