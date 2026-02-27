import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { usePresenters } from "../../shared/presenters/presentersProvider";
import { OverlaySpinner } from "@/shared/spinner/overlaySpinner";
import { LayoutContainer } from "@/shared/layout/layoutContainer";
export const RegisterPage = observer(() => {
  const { registration } = usePresenters();

  useEffect(() => {
    registration.registerWithGoogle()
  }, []);

  return (
    <LayoutContainer>
      <OverlaySpinner isActive={true} />
    </LayoutContainer>
  );
});