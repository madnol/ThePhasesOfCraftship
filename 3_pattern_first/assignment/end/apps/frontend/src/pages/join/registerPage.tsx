import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { usePresenters } from "../../shared/presenters/presentersProvider";
import { OverlaySpinner } from "@/shared/spinner/overlaySpinner";
import { LayoutContainer } from "@/shared/layout/layoutContainer";
import { Users } from "@dddforum/api";
import { RegistrationForm } from "@/modules/auth/components/registrationForm";
import { RegistrationVm } from "@/modules/auth/application/viewModels/registrationVm";

export const RegisterPage = observer(() => {
  const { registration } = usePresenters();
  const [vm, setVm] = useState<RegistrationVm>(new RegistrationVm());

  useEffect(() => {
    setVm(vm);
  }, [registration.vm]);

  return (
    <LayoutContainer>
      <div>Create Account</div>
      <RegistrationForm
        onSubmit={(
          input: Users.Inputs.CreateUserInput,
          allowMarketingEmails: boolean,
        ) => registration.submitRegistrationForm(input, allowMarketingEmails)}
      />
      <OverlaySpinner isActive={vm.isSubmitting} />
    </LayoutContainer>
  );
});
