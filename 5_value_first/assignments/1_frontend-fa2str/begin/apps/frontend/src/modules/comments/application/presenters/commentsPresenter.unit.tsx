import { CommentsPresenter } from "./commentsPresenter";
import { fakeCommentsData } from "../../__tests__/fakeCommentsData";
import { createAPIClient } from "@dddforum/api";
import { FakeLocalStorage } from '../../../../shared/storage/fakeLocalStorage';
import { FakeFirebaseAPI } from "@/modules/auth/fakeFirebaseAPI";
import { AuthStore } from "@/modules/auth/authStore";
import { FirebaseAPI } from "@/modules/auth/firebaseAPI";
import { setupAuthStoreWithOnboardedMember } from "@/shared/testUtils";
import { UserDm } from "@/modules/auth/domain/userDm";
import { FakeCommentsStore } from "../../repos/fakeCommentsStore";

describe('CommentsPresenter', () => {
  const mockedApi = createAPIClient('');
  let fakeLocalStorage: FakeLocalStorage;
  let commentsStore = new FakeCommentsStore(fakeCommentsData);
  let authStore: AuthStore;
  let fakeFirebaseAPI: FirebaseAPI;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    fakeFirebaseAPI = new FakeFirebaseAPI();
    fakeLocalStorage = new FakeLocalStorage();
    authStore = new AuthStore(mockedApi, fakeFirebaseAPI);
  });

  it('can load comments for a post', async () => {
    let commentsPresenter = new CommentsPresenter(commentsStore, authStore);

    await commentsPresenter.loadComments('post-1');

    expect(commentsPresenter.comments).toHaveLength(2);
    expect(commentsPresenter.isLoading).toBe(false);
    expect(commentsPresenter.error).toBe(null);

    let firstComment = commentsPresenter.comments[0];
    expect(firstComment.text).toEqual('This is a great post!');
    expect(firstComment.dateCreated).toBeDefined();
    expect(firstComment.memberUsername).toEqual('testuser1');
    expect(firstComment.points).toEqual(2);
  });

  it('does not let level 1 users upvote comments', async () => {
    let commentsPresenter = new CommentsPresenter(commentsStore, authStore);
    
    // Setup a level 1 user
    const user = new UserDm({
      id: 'test-user-id',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User'
    });
    setupAuthStoreWithOnboardedMember(authStore, user, { reputationLevel: 'Level1' });

    await commentsPresenter.loadComments('post-1');
    
    // Attempt to upvote
    commentsPresenter.upvoteComment();
    
    // Verify the comment points haven't changed
    expect(commentsPresenter.comments[0].points).toEqual(2);
    expect(commentsPresenter.comments[0].canVoteOnComment).toEqual(false);
  });
});
