import { OverlaySpinner } from "@/shared/spinner/overlaySpinner";
import { useStore } from "@/shared/store/storesContext";
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = observer(({ children }: ProtectedRouteProps) => {
  const { auth } = useStore();

  console.log(auth.isLoading, 'loading')
  console.log(auth.isAuthenticated(), 'is authed', toJS(auth.getCurrentUser()))
  
  if (auth.isLoading) {
    return <OverlaySpinner isActive={true} />;
  }

  if (!auth.hasCompletedOnboarding()) {
    return <Navigate to="/onboarding" />;
  }

  if (!auth.isAuthenticated()) {
    return <Navigate to="/join" />;
  }

  return <>{children}</>;
}); 