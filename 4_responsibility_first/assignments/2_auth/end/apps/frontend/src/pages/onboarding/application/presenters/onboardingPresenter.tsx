import { makeAutoObservable } from "mobx";
import { OnboardingVm } from "../viewModels/onboardingVm";
import { NavigationStore } from "@/shared/navigation/navigationStore";
import { MembersStore } from "@/modules/auth/stores/membersStore";

export class OnboardingPresenter {

  public vm: OnboardingVm = new OnboardingVm();

  constructor (
    private navigationStore: NavigationStore,
    private membersStore: MembersStore
  ) {
    makeAutoObservable(this);
  }

  public load (cb?: (vm: OnboardingVm) => void) {

    if (cb) cb(this.vm);
  }

  public async completeOnboarding (username: string, allowMarketing: boolean) {
    try {
      this.vm = new OnboardingVm(true, "");
      
      const result = await this.membersStore.registerMember(username, allowMarketing);

      if (result.isSuccess()) {
        debugger;
        this.navigationStore.navigate('/');
        return true;
      } else {
        this.vm.error = result.getError() || "Failed to register member";
        return false;
      }
    } catch (error) {
      this.vm.error = error instanceof Error ? error.message : "An error occurred";
      return false;
    } finally {
      this.vm.isSubmitting = false;
    }
  }
}