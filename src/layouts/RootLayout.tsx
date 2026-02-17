import { Outlet } from 'react-router-dom';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { GlobalErrorFallback } from '@/components/common/GlobalErrorFallback';
import { NetworkStatus } from '@/components/common/NetworkStatus';
import { ScrollToTop } from '@/components/common/ScrollToTop';
import { BackToTop } from '@/components/common/BackToTop';
import { KeyboardShortcutsDialog } from '@/components/common/KeyboardShortcutsDialog';
import { OnboardingTour } from '@/components/common/OnboardingTour';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useUIStore } from '@/store/ui.store';

export function RootLayout() {
  useKeyboardShortcuts();
  const onboarding = useOnboarding();
  const { isKeyboardShortcutsOpen, setKeyboardShortcutsOpen } = useUIStore();

  return (
    <ErrorBoundary fallback={<GlobalErrorFallback />}>
      <ScrollToTop />
      <NetworkStatus />

      <Outlet />

      <BackToTop />

      <KeyboardShortcutsDialog
        open={isKeyboardShortcutsOpen}
        onOpenChange={setKeyboardShortcutsOpen}
      />

      <OnboardingTour
        isActive={onboarding.isActive}
        steps={onboarding.steps}
        currentStep={onboarding.currentStep}
        totalSteps={onboarding.totalSteps}
        onNext={onboarding.next}
        onSkip={onboarding.skip}
      />
    </ErrorBoundary>
  );
}
