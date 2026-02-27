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
    // Note: the beauty of using commands this way is that we can translate inputs
    // into commands to do a baseline level of validation quickly without needing to 
    // make an entire request to the backend. 
    const commandOrError = Users.Commands.CreateUserCommand.create(input);

    if (commandOrError.isFailure()) {
      this.toastAPI.showError('Validation error')
      // Note: potential improvement is to additionally, transform the command validation error
      // to return the keys that are invalid, then save that as an error object on the view 
      // model.
      return fail(commandOrError.getError())
    }

    // If the form fields are valid, we can continue to submit.
    this.vm.isSubmitting = true;
    const registrationResult = await this.authStore.register(input, allowMarketingEmails)
    if (!registrationResult.success) {
      this.toastAPI.showError('Error registering.')
      this.vm.isSubmitting = false;
      return fail(registrationResult.error as Users.Errors.CreateUserErrors);
    } else {
      this.vm.isSubmitting = false;
      this.toastAPI.showSuccess('Successfully registered. Redirecting home in 3 seconds.')
      this.navigationStore.navigate('/', { inSeconds: 3000 })
      return success(registrationResult.data as Users.DTOs.UserDTO);
    }
  }
}

