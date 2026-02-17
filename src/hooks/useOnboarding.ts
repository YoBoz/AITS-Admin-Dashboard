import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'aits-onboarding-complete';

export interface OnboardingStep {
  target: string;
  title: string;
  description: string;
}

const defaultSteps: OnboardingStep[] = [
  { target: '.sidebar-nav', title: 'Navigation', description: 'Access all modules from the sidebar. Click sections to navigate.' },
  { target: '.kpi-cards-row', title: 'Terminal Overview', description: 'Monitor key metrics at a glance. Hover cards for more details.' },
  { target: '.navbar-search', title: 'Quick Search', description: 'Press Ctrl+K to search pages, trolleys, and shops instantly.' },
  { target: '.navbar-notifications', title: 'Notifications', description: 'Stay updated with real-time alerts and system notifications.' },
  { target: '.theme-toggle', title: 'Dark Mode', description: 'Toggle between light and dark mode to suit your preference.' },
  { target: '.sidebar-settings', title: 'Settings', description: 'Customize language, appearance, and system preferences here.' },
];

/**
 * Hook to manage first-run onboarding tour state.
 */
export function useOnboarding() {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const steps = defaultSteps;

  // Check if onboarding should show on mount
  useEffect(() => {
    const complete = localStorage.getItem(STORAGE_KEY);
    if (!complete) {
      // Small delay to let the page render
      const t = setTimeout(() => setIsActive(true), 1500);
      return () => clearTimeout(t);
    }
  }, []);

  const next = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      complete();
    }
  }, [currentStep, steps.length]);

  const skip = useCallback(() => {
    complete();
  }, []);

  const complete = useCallback(() => {
    setIsActive(false);
    setCurrentStep(0);
    localStorage.setItem(STORAGE_KEY, 'true');
  }, []);

  const restart = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setCurrentStep(0);
    setIsActive(true);
  }, []);

  return {
    isActive,
    currentStep,
    steps,
    step: steps[currentStep],
    totalSteps: steps.length,
    next,
    skip,
    restart,
  };
}
