import { makeAutoObservable, observe } from "mobx";
import { NavigationStore } from "@/shared/navigation/navigationStore";
import { AuthStore } from "@/modules/auth/authStore";
import { OnboardingStatusVm } from "./onboadingStatusVm";

interface OnboardingDetails {
  username: string;
  allowMarketing: boolean;
}

export class OnboardingPresenter {
  private vm: OnboardingStatusVm = new OnboardingStatusVm();

  constructor(
    private navigationStore: NavigationStore,
    private authStore: AuthStore,
  ) {
    makeAutoObservable(this);
    this.setupSubscriptions();
  }

  private async updateViewModel() {
    const member = await this.authStore.getCurrentMember();
    const isAuthenticated = this.authStore.isAuthenticated();
    this.vm = OnboardingStatusVm.fromDomain(member, isAuthenticated);
  }

  get viewModel(): OnboardingStatusVm {
    return this.vm;
  }

  private setupSubscriptions() {
    observe(this.authStore, 'currentMember', async () => {
      await this.updateViewModel();
    });

    observe(this.authStore, 'currentUser', async () => {
      await this.updateViewModel();
    });
  }

  public async load() {
    try {
      await this.updateViewModel();
    } finally {
      this.vm.isLoading = false;
    }
  }

  async registerMember(details: OnboardingDetails) {
    try {
      this.vm.isSubmitting = true;
      this.vm.error = null;

      const user = this.authStore.getCurrentUser();
      if (!user || !user.email) {
        this.vm.error = 'No authenticated user found';
        return false;
      }

      const idToken = this.authStore.getToken();
      if (!idToken) {
        throw new Error("No authentication token found");
      }

      const [memberCreationResponse] = await Promise.all([
        this.authStore.createMember({
          username: details.username,
          email: user.email,
          userId: user.id,
          idToken,
          allowMarketing: details.allowMarketing
        }),
      ]);

      if (memberCreationResponse.success) {
        this.navigationStore.navigate('/');
        return true;
      }
      
      this.vm.error = memberCreationResponse.error?.message || "Failed to register member";
      return false;
    } catch (error) {
      this.vm.error = error instanceof Error ? error.message : "An error occurred";
      return false;
    } finally {
      this.vm.isSubmitting = false;
    }
  }
}