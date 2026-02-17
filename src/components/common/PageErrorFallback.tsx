import { AlertCircle, RefreshCw } from 'lucide-react';

interface PageErrorFallbackProps {
  error?: Error | null;
  onRetry?: () => void;
}

export function PageErrorFallback({ error, onRetry }: PageErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
        <AlertCircle className="w-7 h-7 text-destructive" />
      </div>
      <h2 className="text-lg font-semibold font-[Montserrat] mb-1">Failed to load this section</h2>
      <p className="text-sm text-muted-foreground mb-4 max-w-sm">
        An error occurred while rendering this page. Please try again.
      </p>
      {error && import.meta.env.DEV && (
        <pre className="mb-4 p-3 rounded-lg bg-muted text-xs text-left overflow-auto max-h-24 max-w-md">
          {error.message}
        </pre>
      )}
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  );
}
