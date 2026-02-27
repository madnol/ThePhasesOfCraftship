import { AuthStore } from "@/modules/auth/authStore";
import { PostsStore } from "@/modules/posts/repos/postsStore";
import { NavigationStore } from "@/shared/navigation/navigationStore";
import { SubmissionPresenter } from "./submissionPresenter";
import { UserDm } from "@/modules/auth/domain/userDm";
import { setupAuthStoreWithOnboardedMember } from "@/shared/testUtils";
import { createAPIClient } from "@dddforum/api";
import { FakeFirebaseAPI } from "@/modules/auth/fakeFirebaseAPI";
import { SubmissionViewModel } from "../viewModels/submissionViewModel";

describe('submissionPresenter', () => {
  const mockedApi = createAPIClient('');
  let fakeFirebaseAPI: FakeFirebaseAPI;
  let authStore: AuthStore;
  let navigationStore: NavigationStore;
  let postsStore: PostsStore;
  let presenter: SubmissionPresenter;

  beforeEach(() => {
    jest.clearAllMocks();
    fakeFirebaseAPI = new FakeFirebaseAPI();
    authStore = new AuthStore(mockedApi, fakeFirebaseAPI);
    navigationStore = new NavigationStore();
    postsStore = new PostsStore(mockedApi, authStore);
  });

  it('should not allow level 1 members to post', async () => {
    let viewModel;
    
    // Setup a level 1 user
    const user = new UserDm({
      id: 'test-user-id',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User'
    });
    setupAuthStoreWithOnboardedMember(authStore, user, { reputationLevel: 'Level1' });

    presenter = new SubmissionPresenter(authStore, navigationStore, postsStore);
    await presenter.load((vm) => {
      viewModel = vm;
    });

    expect(viewModel!.canPost).toBe(false);
    expect(viewModel!.disabledMessage).toBe("Cannot post until level 2! Go leave comments and engage with posts.");
  });

  it('should allow level 2 members or above to post', async () => {
    let viewModel: SubmissionViewModel;
    
    // Setup a level 2 user
    const user = new UserDm({
      id: 'test-user-id',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User'
    });
    setupAuthStoreWithOnboardedMember(authStore, user, { reputationLevel: 'Level2' });

    presenter = new SubmissionPresenter(authStore, navigationStore, postsStore);
    await presenter.load((vm) => {
      viewModel = vm;
    });

    console.log(viewModel!);

    expect(viewModel!.canPost).toBe(true);
    expect(viewModel!.disabledMessage).toBeUndefined();
  });
});
