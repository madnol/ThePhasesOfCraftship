
import { LayoutPresenter } from "./layoutPresenter";
import { AuthStore } from "@/modules/auth/stores/authStore";
import { createAPIClient } from "@dddforum/api";
import { NavigationStore } from "@/shared/navigation/navigationStore";

import { NavLayoutVm } from "../viewModels/navLayoutVm";
import { setupAuthStoreWithMember } from "@/shared/testUtils";

describe('LayoutPresenter', () => {
  let presenter: LayoutPresenter;
  let authStore: AuthStore;
  let navigationStore: NavigationStore;
  let loadedVm: NavLayoutVm;

  beforeEach(() => {
    const apiClient = createAPIClient('');
    
    authStore = new AuthStore(apiClient);
    navigationStore = new NavigationStore();
    presenter = new LayoutPresenter(authStore, navigationStore);
  });

  describe('layout', () => {
    it('should show username when member is authenticated', async () => {
      // Setu
      
      setupAuthStoreWithMember(authStore, {
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
      setupAuthStoreWithMember(authStore, {
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
