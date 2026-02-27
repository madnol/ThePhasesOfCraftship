import { NavigationStore } from "@/shared/navigation/navigationStore";
import { RegistrationPresenter } from "./registrationPresenter";
import { AuthStore } from "../../stores/authStore";
import { ToastAPI } from "@/shared/toast/toastAPI";
import { createAPIClient } from "@dddforum/api";

function setupSuccessfulRegistration (presenter: RegistrationPresenter) {
  const mockUserDTO = {
    id: '123',
    email: 'khalil@essentialist.dev',
    username: 'khalilstemmler',
    firstName: 'khalil',
    lastName: 'stemmler'
  };

  presenter.toastAPI.showError = jest.fn();
  presenter.navigationStore.navigate = jest.fn();
  presenter.authStore.apiClient.users.register = jest.fn(async() => {
    return { success: true, data: mockUserDTO }
  })
}

describe('registrationPresenter', () => {
  
  const apiClient = createAPIClient('http://localhost:3000');
  let toastAPI = new ToastAPI()
  let authStore = new AuthStore(apiClient);
  let navigationStore = new NavigationStore();
  let registrationPresenter = new RegistrationPresenter(
    navigationStore,
    authStore,
    toastAPI
  )
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registering', () => {
    it('should redirect to the main page after a successful registration', async () => {
      setupSuccessfulRegistration(registrationPresenter)
      
      await registrationPresenter.submitRegistrationForm({ 
        email: 'khalil@essentialist.dev', 
        username: 'khalilstemmler', 
        firstName: "khalil", 
        lastName: "stemmmler" 
      }, false);
  
      expect (registrationPresenter.navigationStore.navigate).toHaveBeenCalledWith('/', { inSeconds: 3000});
    });

    
    test('on invalid submissions, it should present failure toast', async () => {
      registrationPresenter.toastAPI.showError = jest.fn();
      const response = await registrationPresenter.submitRegistrationForm({ 
        email: 'invalid', 
        username: 'a', 
        firstName: "khalil", 
        lastName: "" 
      }, false);
      expect(response.isSuccess()).toBeFalsy();
      expect(registrationPresenter.toastAPI.showError).toHaveBeenCalled();
      // expect(response).toBeInstanceOf(ValidationError);
      // expect((response as ValidationError).message).toBe('Email invalid');
    });
  });

  it ('should not call an error toast when a valid form is submitted', () => {
    registrationPresenter.toastAPI.showError = jest.fn();
    registrationPresenter.submitRegistrationForm({ 
      email: 'khalil@essentialist.dev', 
      username: 'khalilstemmler', 
      firstName: "khalil", 
      lastName: "stemmmler" 
    }, false);
    expect (registrationPresenter.toastAPI.showError).toHaveBeenCalledTimes(0);
  });

  

  it('should cache the user to the store after a successful registration', async () => {
    setupSuccessfulRegistration(registrationPresenter)
    
    await registrationPresenter.submitRegistrationForm({ 
      email: 'khalil@essentialist.dev', 
      username: 'khalilstemmler', 
      firstName: "khalil", 
      lastName: "stemmmler" 
    }, false);

    expect(registrationPresenter.vm.isSubmitting).toBeFalsy();
    expect(registrationPresenter.authStore.authState.isLoading).toBeFalsy();
    expect(registrationPresenter.authStore.authState.user).toBeDefined();
  });
})
