import { Navigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { OverlaySpinner } from '@/shared/spinner/overlaySpinner';
import { usePresenters } from '@/shared/presenters/presentersContext';
import { useEffect } from 'react';

interface OnboardingGuardProps {
  children: React.ReactNode;
}

/**
 * Technically, guards like this are incoming adapters which can be tested if they're mocked appropriately.
 * We use the onboardingPresenter to manage the onboarding state and navigation logic.
 */

export const OnboardingGuard = observer(({ children }: OnboardingGuardProps) => {
  const { onboarding } = usePresenters();
  
  useEffect(() => {
    onboarding.load();
  }, [onboarding]);

  const vm = onboarding.viewModel;
  
  if (vm.isLoading) {
    return <OverlaySpinner isActive={true} />;
  }

  // If they're authenticated but haven't completed onboarding, send them to onboarding
  if (vm.isAuthenticated && !vm.hasCompletedOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  // If they're on the onboarding page but have completed it, redirect to home
  if (vm.isAuthenticated && vm.hasCompletedOnboarding && window.location.pathname === '/onboarding') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
});