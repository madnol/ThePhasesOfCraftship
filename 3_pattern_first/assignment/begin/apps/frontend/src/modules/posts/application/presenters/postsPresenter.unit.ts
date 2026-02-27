import { PostsPresenter } from "./postsPresenter";
import { fakePostsData } from "../../__tests__/fakePostsData";
import { SearchFilterViewModel } from "../viewModels/searchFilterViewModel";
import { createAPIClient } from "@dddforum/api";
import { AuthStore } from "@/modules/auth/stores/authStore";
import { setupAuthStoreWithMember } from "@/shared/testUtils";
import { PostViewModel } from "../viewModels/postViewModel";
import { FakePostsStore } from "../../stores/fakePostsStore";

describe('PostsPresenter', () => {

  const stubbedAPI = createAPIClient('');
  let loadedPostsVm: PostViewModel[] = [];
  let postsStore = new FakePostsStore(fakePostsData);
  let authStore: AuthStore;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    authStore = new AuthStore(stubbedAPI);
  })

  it ('can render a list of posts', async () => {
    // Implement
  });

  it ('can switch between popular posts and new posts', async () => {
// Implement
  });

  it ('does not let level 1 users cast votes', async () => {
// Implement
  });

  it('does let level 2 users cast votes', async () => {
// Implement
  });

})
