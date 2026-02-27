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
      // Implement
    });

    test('on invalid submissions, it should present failure toast', async () => {
      // Implement
    });
  
    it ('should not call an error toast when a valid form is submitted', () => {
      // Implement
    });
  
    it('should cache the user to the store after a successful registration', async () => {
      // Implement
    });
  });
  
})
