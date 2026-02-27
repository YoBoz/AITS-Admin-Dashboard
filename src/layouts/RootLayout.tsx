import { Outlet } from 'react-router-dom';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { GlobalErrorFallback } from '@/components/common/GlobalErrorFallback';
import { NetworkStatus } from '@/components/common/NetworkStatus';
import { ScrollToTop } from '@/components/common/ScrollToTop';
import { BackToTop } from '@/components/common/BackToTop';
import { KeyboardShortcutsDialog } from '@/components/common/KeyboardShortcutsDialog';
import { UnfocusShield } from '@/components/common/UnfocusShield';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useUIStore } from '@/store/ui.store';

export function RootLayout() {
  useKeyboardShortcuts();
  const { isKeyboardShortcutsOpen, setKeyboardShortcutsOpen } = useUIStore();

  return (
    <ErrorBoundary fallback={<GlobalErrorFallback />}>
      <ScrollToTop />
      <NetworkStatus />

      <Outlet />

      <BackToTop />

      <UnfocusShield />

      <KeyboardShortcutsDialog
        open={isKeyboardShortcutsOpen}
        onOpenChange={setKeyboardShortcutsOpen}
      />
    </ErrorBoundary>
  );
}
