import { LayoutPresenter } from "./layoutPresenter";
import { AuthStore } from "@/modules/auth/stores/authStore";
import { createAPIClient } from "@dddforum/api";
import { NavigationStore } from "@/shared/navigation/navigationStore";
import { NavLayoutVm } from "../viewModels/navLayoutVm";
import { setupAuthStoreWithAuthenticatedUser } from "@/shared/testUtils";
import { ProductionFirebaseAPI } from "@/modules/auth/infra/firebase/productionFirebaseAPI";
import { UserDm } from "@/modules/auth/domain/userDm";

// Note: This could use a refactor since moving to using firebase. We are splitting
// the fixture work into utility functions and beforeEachs.

describe('LayoutPresenter', () => {
  let presenter: LayoutPresenter;
  let authStore: AuthStore;
  let navigationStore: NavigationStore;
  let loadedVm: NavLayoutVm;
  let firebaseAPI: ProductionFirebaseAPI;

  beforeEach(() => {
    const apiClient = createAPIClient('');
    
    firebaseAPI = new ProductionFirebaseAPI({
      apiKey: 'test-api-key',
      authDomain: 'test-auth-domain', 
      projectId: 'test-project-id'
    });

    authStore = new AuthStore(apiClient, firebaseAPI);
    navigationStore = new NavigationStore();
    presenter = new LayoutPresenter(authStore, navigationStore);

    // Mock the waitForAuthenticatedUser method
    jest.spyOn(firebaseAPI, 'waitForAuthenticatedUser').mockResolvedValue(
      new UserDm({
        id: 'test-user-id',
        email: 'test@example.com',
        idToken: 'test-token'
      })
    );
  });

  describe('layout', () => {
    it('should show username when member is authenticated', async () => {
      // Setup
      setupAuthStoreWithAuthenticatedUser(authStore, {
        username: 'khalilstemmler'
      });

      // Execute
      await presenter.load((vm) => {
        loadedVm = vm;
      });

      // Assert
      expect(loadedVm.username).toBe('khalilstemmler');
      expect(loadedVm.isAuthenticated).toBe(true);
    });

    it('should show no username when member is not authenticated', async () => {
      // Mock the waitForAuthenticatedUser method
    jest.spyOn(firebaseAPI, 'waitForAuthenticatedUser').mockResolvedValue(
      null
    );

      // Execute
      await presenter.load((vm) => {
        loadedVm = vm;
      });

      // Assert
      expect(loadedVm.username).toBeNull();
      expect(loadedVm.isAuthenticated).toBe(false);
    });
  });

  describe('actions', () => {
    it('should sign out the member and navigate to home', async () => {
      // Setup
      setupAuthStoreWithAuthenticatedUser(authStore, {
        username: 'testuser'
      });
      const logoutSpy = jest.spyOn(authStore, 'logout');
      const navigateSpy = jest.spyOn(navigationStore, 'navigate');

      // Execute
      await presenter.signOut();

      // Assert
      expect(logoutSpy).toHaveBeenCalled();
      expect(navigateSpy).toHaveBeenCalledWith('/');
    });
  });
});
