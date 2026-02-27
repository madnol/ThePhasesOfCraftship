import { OnboardingPresenter } from "./onboardingPresenter";
import { FakeLocalStorage } from '../../../../shared/storage/fakeLocalStorage';
import { AuthStore } from "@/modules/auth/authStore";
import { FakeFirebaseAPI } from "@/modules/auth/fakeFirebaseAPI";
import { createAPIClient } from "@dddforum/api";
import { NavigationStore } from '@/shared/navigation/navigationStore'
import { setupAuthStoreWithAuthenticatedUser } from "@/shared/testUtils";
import { MemberDm } from "../../domain/memberDm";

// You have to replicate the way it's imported. We export "appConfig"
jest.mock('@/config', () => ({
  appConfig: {
    apiURL: 'http://localhost:3000',
    firebase: {
      apiKey: 'test-api-key',
      authDomain: 'test-auth-domain', 
      projectId: 'test-project-id'
    }
  }
}));

describe('OnboardingPresenter', () => {

  describe('member registration', () => {
    let presenter: OnboardingPresenter;
    let navigationStore: NavigationStore
    let fakeFirebaseAPI: FakeFirebaseAPI;
    let fakeLocalStorage: FakeLocalStorage;
    let authStore: AuthStore;

    beforeEach(() => {
      let apiClient = createAPIClient('');
      fakeLocalStorage = new FakeLocalStorage();
      fakeFirebaseAPI = new FakeFirebaseAPI();

      navigationStore = new NavigationStore();

      authStore = new AuthStore(
        apiClient,
        fakeFirebaseAPI,
      );

      presenter = new OnboardingPresenter(
        navigationStore,
        authStore,
      );
    });
  
    afterEach(() => {
      jest.restoreAllMocks();
    });

    test('Given the user exists, then it should successfully be able to register a member', async () => {
      
      /**
       * If the user happens to be on the onboarding page, this is where we can verify that it works correctly.
       * We are testing the registerMember method on the onboarding presenter. As a unit test, this may simply
       * verify using State Verification on the associated presenters, that they end up with the right details.
       */

      let { user } = setupAuthStoreWithAuthenticatedUser(authStore);
      let memberDetails = {
        username: 'testuser'
      }

      // Mock isAuthenticated
      jest.spyOn(authStore, 'isAuthenticated').mockReturnValue(true);

      jest.spyOn(authStore['apiClient']['members'], 'create').mockResolvedValue({
        success: true,
        data: {
          memberId: 'test-member-id',
          userId: user.id,
          username: memberDetails.username,
          reputationLevel: 'Level1',
          reputationScore: 0
        }
      });

      let navigationSpy = jest.spyOn(navigationStore, 'navigate');

      const result = await presenter.registerMember({
        username: memberDetails.username,
        allowMarketing: false
      });

      const vm = presenter.viewModel;

      expect(result).toBe(true);
      expect(vm.currentMember).not.toBe(null);
      expect(vm.currentMember?.username).toBe(memberDetails.username);
      expect(vm.currentMember?.reputationLevel === 'Level1').toBe(true)
      expect(vm.isAuthenticated).toBe(true);
      expect(navigationSpy).toHaveBeenCalledWith('/');
      expect(vm.isSubmitting).toBe(false);
      expect(vm.error).toBeNull();
    });

    test('Should fail to complete onboarding if the user has not yet been created', async () => {
      /**
       * If under some circumstance, the user is on the onboarding page and they are not authenticated,
       * then this should fail. This test is useful, however, a more useful test and functionality would be
       * to subscribe to the auth state changes of firebase, and redirect to the "/" page when auth state
       * changes.
       */

      // Setup
      authStore['currentUser'] = null;
      let memberDetails = {
        username: 'testuser'
      };

      // Mock isAuthenticated
      jest.spyOn(authStore, 'isAuthenticated').mockReturnValue(false);

      let navigationSpy = jest.spyOn(navigationStore, 'navigate');

      // Execute
      const result = await presenter.registerMember({
        username: memberDetails.username,
        allowMarketing: false
      });

      const vm = presenter.viewModel;

      // Assert
      expect(result).toBe(false);
      expect(vm.error).toBe('No authenticated user found');
      expect(vm.isAuthenticated).toBe(false);
      expect(navigationSpy).not.toHaveBeenCalled();
      expect(vm.isSubmitting).toBe(false);
      expect(vm.currentMember).toBe(null);
    });

    test('Should properly load onboarding status', async () => {
      let { user } = setupAuthStoreWithAuthenticatedUser(authStore);
      
      // Mock isAuthenticated
      jest.spyOn(authStore, 'isAuthenticated').mockReturnValue(true);

      // Mock the getCurrentMember response
      jest.spyOn(authStore, 'getCurrentMember').mockResolvedValue(
        new MemberDm({
          id: 'test-member-id',
          username: 'testuser',
          email: 'test@example.com',
          userId: user.id,
          reputationLevel: 'Level1'
        })
      );

      await presenter.load();
      const vm = presenter.viewModel;

      expect(vm.isLoading).toBe(false);
      expect(vm.hasCompletedOnboarding).toBe(true);
      expect(vm.isAuthenticated).toBe(true);
      expect(vm.currentMember).not.toBe(null);
      expect(vm.error).toBeNull();
    });

    test('Should handle unauthenticated state', async () => {
      // Mock isAuthenticated
      jest.spyOn(authStore, 'isAuthenticated').mockReturnValue(false);
      jest.spyOn(authStore, 'getCurrentMember').mockResolvedValue(null);

      await presenter.load();
      const vm = presenter.viewModel;

      expect(vm.isLoading).toBe(false);
      expect(vm.hasCompletedOnboarding).toBe(false);
      expect(vm.isAuthenticated).toBe(false);
      expect(vm.currentMember).toBe(null);
      expect(vm.error).toBeNull();
    });
  });
});
