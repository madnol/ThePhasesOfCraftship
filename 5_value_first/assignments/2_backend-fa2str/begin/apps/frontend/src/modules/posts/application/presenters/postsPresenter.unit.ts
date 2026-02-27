import { PostsPresenter } from "./postsPresenter";
import { fakePostsData } from "../../__tests__/fakePostsData";
import { SearchFilterViewModel } from "../viewModels/searchFilterViewModel";
import { createAPIClient } from "@dddforum/api";
import { AuthStore } from "@/modules/auth/stores/authStore";
import { setupAuthStoreWithMember } from "@/shared/testUtils";
import { PostViewModel } from "../viewModels/postViewModel";
import { FakePostsStore } from "../../stores/fakePostsStore";
import { ProductionFirebaseAPI } from "@/modules/auth/infra/firebase/productionFirebaseAPI";
import { UserDm } from "@/modules/auth/domain/userDm";

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

describe('PostsPresenter', () => {

  const stubbedAPI = createAPIClient('');
  let loadedPostsVm: PostViewModel[] = [];
  let postsStore = new FakePostsStore(fakePostsData);
  let authStore: AuthStore;
  
  let firebaseAPI = new ProductionFirebaseAPI({
    apiKey: 'test-api-key',
    authDomain: 'test-auth-domain', 
    projectId: 'test-project-id'
  })

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    authStore = new AuthStore(stubbedAPI, firebaseAPI);
    
    // Mock the waitForAuthenticatedUser method
    jest.spyOn(firebaseAPI, 'waitForAuthenticatedUser').mockResolvedValue(
      new UserDm({
        id: 'test-user-id',
        email: 'test@example.com',
        idToken: 'test-token'
      })
    );
  })

  it ('can render a list of posts', async () => {
    let postsPresenter = new PostsPresenter(postsStore, authStore);

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

    let postsPresenter = new PostsPresenter(postsStore, authStore);

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
    let postsPresenter = new PostsPresenter(postsStore, authStore);
    
    setupAuthStoreWithMember(authStore, { reputationLevel: 'Level1' });

    await postsPresenter.load((postsVm) => {
      loadedPostsVm = postsVm;
    });
    
    expect(loadedPostsVm).toHaveLength(3);
    expect(loadedPostsVm[0].canCastVote).toEqual(false);
    expect(loadedPostsVm[1].canCastVote).toEqual(false);
    expect(loadedPostsVm[2].canCastVote).toEqual(false);
  });

  it('does let level 2 users cast votes', async () => {
    let postsPresenter = new PostsPresenter(postsStore, authStore);
    
    setupAuthStoreWithMember(authStore, { reputationLevel: 'Level2' });

    await postsPresenter.load((postsVm) => {
      loadedPostsVm = postsVm;
    });

    expect(loadedPostsVm).toHaveLength(3);
    expect(loadedPostsVm[0].canCastVote).toEqual(true);
    expect(loadedPostsVm[1].canCastVote).toEqual(true);
    expect(loadedPostsVm[2].canCastVote).toEqual(true);
  });

})
