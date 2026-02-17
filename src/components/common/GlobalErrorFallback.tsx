import { AlertTriangle, RefreshCw, LayoutDashboard } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

interface GlobalErrorFallbackProps {
  error?: Error | null;
}

export function GlobalErrorFallback({ error }: GlobalErrorFallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-[#BE052E] flex items-center justify-center">
            <span className="text-white font-bold text-sm">Ai</span>
          </div>
          <span className="text-xl font-bold font-[Montserrat]">{APP_NAME}</span>
        </div>

        {/* Error icon */}
        <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>

        <div>
          <h1 className="text-2xl font-bold font-[Montserrat] mb-2">Something went wrong</h1>
          <p className="text-muted-foreground text-sm">
            An unexpected error occurred. Please try reloading the page.
          </p>
          {error && import.meta.env.DEV && (
            <pre className="mt-3 p-3 rounded-lg bg-muted text-xs text-left overflow-auto max-h-32">
              {error.message}
            </pre>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#BE052E] text-white font-medium text-sm hover:bg-[#a00425] transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Reload Page
          </button>
          <a
            href="/dashboard/overview"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-border text-foreground font-medium text-sm hover:bg-muted transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            Go to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
