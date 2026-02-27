
import { observer } from 'mobx-react-lite';
import { LayoutContainer } from "@/shared/layout/layoutContainer";
import { usePresenters } from '@/shared/presenters/presentersProvider';
import { OnboardingForm } from './components/onboardingForm';
import { useEffect, useState } from 'react';
import { OnboardingVm } from './application/viewModels/onboardingVm';
import { OverlaySpinner } from '@/shared/spinner/overlaySpinner';

export const OnboardingPage = observer(() => {
  const { onboarding: presenter } = usePresenters();
  const [vm, setVm] = useState<OnboardingVm>();

    useEffect(() => {
      presenter.load((loadedVm) => {
        setVm(loadedVm)
      })
    }, [presenter.vm])

  if (!vm) return <OverlaySpinner isActive={true} />

  return (
    <LayoutContainer>
      <OnboardingForm
        onboardingVm={vm}
        submitForm={(username, allowMarketing) => presenter.completeOnboarding(username, allowMarketing)}
      />
      <OverlaySpinner isActive={vm.isSubmitting} />
    </LayoutContainer>
  );
}); 