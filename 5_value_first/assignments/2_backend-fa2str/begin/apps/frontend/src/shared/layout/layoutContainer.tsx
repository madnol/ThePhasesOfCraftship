
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { NavLayoutVm } from "./application/viewModels/navLayoutVm";
import { usePresenters } from "../presenters/presentersProvider";
import { LayoutComponent } from "./components/layoutComponent";
import { OverlaySpinner } from "../spinner/overlaySpinner";

// All components which use observables must use 'observer'
export const LayoutContainer = observer(({ children }: any) => {
  const { layout } = usePresenters();
  const [vm, setVmToLocalState] = useState<NavLayoutVm>();

  useEffect(() => {
    layout.load((navLayoutVm) => {
      setVmToLocalState(navLayoutVm);
    });
  }, [layout.navLayoutVm]); // We observe the view model in the presenter

  if (!vm) return <OverlaySpinner isActive={true}/>

  return (
    <LayoutComponent vm={vm} signOut={() => layout.signOut()}>
      {children}
    </LayoutComponent>
  );
});
