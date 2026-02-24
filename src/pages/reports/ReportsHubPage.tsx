// ──────────────────────────────────────
// Reports Hub — renders AdminReportsPage directly
// ──────────────────────────────────────

import { lazy, Suspense } from 'react';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

const AdminReportsPage = lazy(() => import('./AdminReportsPage'));

export default function ReportsHubPage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingScreen />}>
        <AdminReportsPage />
      </Suspense>
    </ErrorBoundary>
  );
}
