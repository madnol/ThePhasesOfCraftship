import { PostDetailsPresenter } from "./postDetailsPresenter";
import { FakePostsRepository } from "../../repos/fakePostsRepository";
import { fakePostsData } from "../../__tests__/fakePostsData";
import { createAPIClient } from "@dddforum/api";
import { FakeLocalStorage } from '../../../../shared/storage/fakeLocalStorage';
import { FakeFirebaseAPI } from "@/modules/auth/fakeFirebaseAPI";
import { AuthStore } from "@/modules/auth/authStore";
import { FirebaseAPI } from "@/modules/auth/firebaseAPI";
import { setupAuthStoreWithOnboardedMember } from "@/shared/testUtils";
import { UserDm } from "@/modules/auth/domain/userDm";

describe('PostDetailsPresenter', () => {
  const mockedApi = createAPIClient('');
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
  });

  describe('permissions', () => {
    it('does not allow level 1 members to upvote or downvote the posts', async () => {
      let postDetailsPresenter = new PostDetailsPresenter(postsRepository, authStore);
      
      // Setup a level 1 user
      const user = new UserDm({
        id: 'test-user-id',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User'
      });
      setupAuthStoreWithOnboardedMember(authStore, user, { reputationLevel: 'Level1' });
  
      await postDetailsPresenter.loadPost('/first-post');
      
      expect(postDetailsPresenter.post).toBeDefined();
      expect(postDetailsPresenter.post!.canCastVote).toEqual(false);
  
      // Initial vote score
      const initialVoteScore = postDetailsPresenter.post!.voteScore;
  
      // Attempt to upvote
      await postDetailsPresenter.upvotePost();
      expect(postDetailsPresenter.post!.voteScore).toEqual(initialVoteScore);
  
      // Attempt to downvote
      await postDetailsPresenter.downvotePost();
      expect(postDetailsPresenter.post!.voteScore).toEqual(initialVoteScore);
    });
  
    it('allows level 2 or above members to upvote and downvote the post', async () => {
      let postDetailsPresenter = new PostDetailsPresenter(postsRepository, authStore);
      
      // Setup a level 2 user
      const user = new UserDm({
        id: 'test-user-id',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User'
      });
      setupAuthStoreWithOnboardedMember(authStore, user, { reputationLevel: 'Level2' });
  
      await postDetailsPresenter.loadPost('/first-post');
      
      expect(postDetailsPresenter.post).toBeDefined();
      expect(postDetailsPresenter.post!.canCastVote).toEqual(true);
    });
  })

  describe('rendering', () => {
    it('renders text posts and presents the details about the post', async () => {
      let postDetailsPresenter = new PostDetailsPresenter(postsRepository, authStore);
  
      await postDetailsPresenter.loadPost('/first-post');
  
      expect(postDetailsPresenter.isLoading).toBe(false);
      expect(postDetailsPresenter.error).toBe(null);
      expect(postDetailsPresenter.post).toBeDefined();
  
      const post = postDetailsPresenter.post!;
      expect(post.title).toEqual('This is my first post');
      expect(post.content).toEqual('First post content');
      expect(post.dateCreated).toBeDefined();
      expect(post.voteScore).toEqual(4);
    });
  
    it('renders link posts without any text, providing the link to view', async () => {
      // Add a link post to the fake data
      const linkPost = {
        ...fakePostsData[0],
        id: "4",
        title: "Link post",
        content: undefined,
        link: "https://example.com",
        postType: "link",
        slug: '/link-post'
      };
      postsRepository = new FakePostsRepository([...fakePostsData, linkPost]);
      let postDetailsPresenter = new PostDetailsPresenter(postsRepository, authStore);
  
      await postDetailsPresenter.loadPost('/link-post');
  
      expect(postDetailsPresenter.isLoading).toBe(false);
      expect(postDetailsPresenter.error).toBe(null);
      expect(postDetailsPresenter.post).toBeDefined();
  
      const post = postDetailsPresenter.post!;
      expect(post.title).toEqual('Link post');
      expect(post.content).toBeUndefined();
      expect(post.link).toEqual('https://example.com');
    });
  })

});
