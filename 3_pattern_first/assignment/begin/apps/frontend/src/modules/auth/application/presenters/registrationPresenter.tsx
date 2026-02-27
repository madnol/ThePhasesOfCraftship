import { makeAutoObservable } from "mobx";
import { AuthStore } from '@/modules/auth/stores/authStore';
import { NavigationStore } from "@/shared/navigation/navigationStore";
import { RegistrationVm } from "../viewModels/registrationVm";
import { Users } from "@dddforum/api";
import { ToastAPI } from "@/shared/toast/toastAPI";
import { Result, success, fail } from "@dddforum/core";

export class RegistrationPresenter {

  public vm: RegistrationVm = new RegistrationVm();

  constructor (
    public navigationStore: NavigationStore,
    public authStore: AuthStore,
    public toastAPI: ToastAPI
  ) {
    makeAutoObservable(this);
  }

  /**
   * @desc This method acts as the equivalent of an application layer use case on the backend.
   * @param input 
   * @param allowMarketingEmails 
   */

  async submitRegistrationForm (input: Users.Inputs.CreateUserInput, allowMarketingEmails: boolean): Promise<Result<Users.DTOs.UserDTO, Users.Errors.CreateUserErrors>> {
    // Implement
    // @ts-ignore
    return fail()
  }
}

