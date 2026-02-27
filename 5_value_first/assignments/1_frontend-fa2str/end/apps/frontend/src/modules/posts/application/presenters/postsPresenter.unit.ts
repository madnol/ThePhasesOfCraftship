import { PostsPresenter } from "./postsPresenter";
import { FakePostsRepository } from "../../repos/fakePostsRepository";
import { fakePostsData } from "../../__tests__/fakePostsData";
import { SearchFilterViewModel } from "../viewModels/searchFilterViewModel";
import { createAPIClient } from "@dddforum/api";
import { FakeLocalStorage } from '../../../../shared/storage/fakeLocalStorage';
import { FakeFirebaseAPI } from "@/modules/auth/fakeFirebaseAPI";
import { AuthStore } from "@/modules/auth/authStore";
import { FirebaseAPI } from "@/modules/auth/firebaseAPI";
import { setupAuthStoreWithOnboardedMember } from "@/shared/testUtils";
import { UserDm } from "@/modules/auth/domain/userDm";
import { PostViewModel } from "../viewModels/postViewModel";

describe('PostsPresenter', () => {

  const mockedApi = createAPIClient('');
  let loadedPostsVm: PostViewModel[] = [];
  let fakeLocalStorage: FakeLocalStorage;
  let postsRepository = new FakePostsRepository(fakePostsData);
  let authStore: AuthStore;
  let fakeFirebaseAPI: FirebaseAPI;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    fakeFirebaseAPI = new FakeFirebaseAPI();
    fakeLocalStorage = new FakeLocalStorage();
    authStore = new AuthStore(mockedApi, fakeFirebaseAPI);
  })

  it ('can render a list of posts', async () => {
    
    let postsPresenter = new PostsPresenter(postsRepository, authStore);

    await postsPresenter.load((postsVm) => {
      loadedPostsVm = postsVm;
    });

    expect(loadedPostsVm).toHaveLength(3);

    let firstPost = loadedPostsVm[0];
    expect(firstPost.title).toEqual('This is my first post');
    expect(firstPost.dateCreated).toBeDefined();
    expect(firstPost.canCastVote).toEqual(false);
    expect(firstPost.voteScore).toEqual(4);
  });

  it ('can switch between popular posts and new posts', async () => {
    let loadedPostsVm: PostViewModel[] = [];
    let activeSearchFilter: SearchFilterViewModel = new SearchFilterViewModel('popular');

    let postsPresenter = new PostsPresenter(postsRepository, authStore);

    await postsPresenter.load((postsVm, searchFilterVm) => {
      loadedPostsVm = postsVm;
      activeSearchFilter = searchFilterVm;
    });
    expect(loadedPostsVm).toHaveLength(3);
    expect(activeSearchFilter.value).toEqual('popular');
    expect(loadedPostsVm[0].voteScore).toBeGreaterThanOrEqual(loadedPostsVm[1].voteScore);
    expect(loadedPostsVm[1].voteScore).toBeGreaterThanOrEqual(loadedPostsVm[2].voteScore);

    postsPresenter.switchSearchFilter('recent');

    await postsPresenter.load((postsVm, searchFilterVm) => {
      loadedPostsVm = postsVm;
      activeSearchFilter = searchFilterVm;
    });

    expect(loadedPostsVm).toHaveLength(3);
    expect(activeSearchFilter.value).toEqual('recent');
    expect(Date.parse(loadedPostsVm[0].dateCreated)).toBeGreaterThanOrEqual(Date.parse(loadedPostsVm[1].dateCreated));
    expect(Date.parse(loadedPostsVm[1].dateCreated)).toBeGreaterThanOrEqual(Date.parse(loadedPostsVm[2].dateCreated));
  });

  it ('does not let level 1 users cast votes', async () => {
    let postsPresenter = new PostsPresenter(postsRepository, authStore);
    
    // Setup a level 1 user
    const user = new UserDm({
      id: 'test-user-id',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User'
    });
    setupAuthStoreWithOnboardedMember(authStore, user, { reputationLevel: 'Level1' });

    await postsPresenter.load((postsVm) => {
      loadedPostsVm = postsVm;
    });
    
    expect(loadedPostsVm).toHaveLength(3);
    expect(loadedPostsVm[0].canCastVote).toEqual(false);
    expect(loadedPostsVm[1].canCastVote).toEqual(false);
    expect(loadedPostsVm[2].canCastVote).toEqual(false);
  });

  it('does let level 2 users cast votes', async () => {
    let postsPresenter = new PostsPresenter(postsRepository, authStore);
    
    // Setup a level 2 user
    const user = new UserDm({
      id: 'test-user-id',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User'
    });
    setupAuthStoreWithOnboardedMember(authStore, user, { reputationLevel: 'Level2' });

    await postsPresenter.load((postsVm) => {
      loadedPostsVm = postsVm;
    });

    expect(loadedPostsVm).toHaveLength(3);
    expect(loadedPostsVm[0].canCastVote).toEqual(true);
    expect(loadedPostsVm[1].canCastVote).toEqual(true);
    expect(loadedPostsVm[2].canCastVote).toEqual(true);
  });
})
