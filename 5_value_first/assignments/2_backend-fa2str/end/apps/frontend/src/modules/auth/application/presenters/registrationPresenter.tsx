import { makeAutoObservable } from "mobx";
import { AuthStore } from '@/modules/auth/stores/authStore';
import { NavigationStore } from "@/shared/navigation/navigationStore";
import { RegistrationVm } from "../viewModels/registrationVm";
import { ToastAPI } from "@/shared/toast/toastAPI";
import { FirebaseAPI } from "../../infra/firebase/firebaseAPI";

export class RegistrationPresenter {

  public vm: RegistrationVm = new RegistrationVm();

  constructor (
    public navigationStore: NavigationStore,
    public authStore: AuthStore,
    public toastAPI: ToastAPI,
    public firebaseAPI: FirebaseAPI
  ) {
    makeAutoObservable(this);
  }

  async registerWithGoogle () {
    // Sign in or register w/ google
    const user = await this.firebaseAPI.signInWithGoogle();
    this.authStore.setUser(user);
    this.navigationStore.navigate('/onboarding');
  }
}
