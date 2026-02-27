import { Config } from "@dddforum/config";
import { CompositionRoot } from "../../../src/shared/compositionRoot";
import { DatabaseFixture } from "../../fixtures/e2e/database";
import { setupLevel3Member } from "../../fixtures/e2e/members";
import { createFakeAuthTokenAndUser } from "../../fixtures/e2e/users";
import { Inputs as VotesInputs } from '@dddforum/api/votes'
import { createAPIClient } from "@dddforum/api";
import { setupComment } from "../../fixtures/e2e/comments";

jest.setTimeout(30000);

describe('votes', () => {

  let databaseFixture: DatabaseFixture;
  const apiClient = createAPIClient("http://localhost:3000");
  let appComposition: CompositionRoot;
  const config: Config = Config("test:e2e");

  beforeAll(async () => {
    appComposition = CompositionRoot.createCompositionRoot(config);
    databaseFixture = new DatabaseFixture(appComposition);
    await appComposition.start();
  });

  afterAll(async () => {
    await appComposition.stop();
  });

  describe('super upvote', () => {
    test.only('Given I am a level 3 user with a reputation score of 16, when I upvote an existing comment, the value of my comment should be worth 2 points', async () => {
      const { token, userId } = await createFakeAuthTokenAndUser();
      const { member } = await setupLevel3Member(apiClient, token, userId, databaseFixture, 16);
      const { comment } = await setupComment(apiClient);
  
      const voteData: VotesInputs.VoteOnCommentInput = {
        memberId: member.id,
        commentId: comment.id,
        voteType: 'upvote'
      };
  
     const responseData = await apiClient.votes.voteOnComment(voteData, token);
  
      // Request succeeds
      expect(responseData).toBeDefined();
      expect(responseData.success).toBe(true);
      expect(responseData.data?.commentId).toBe(comment.id);
      expect(responseData.data?.memberId).toBe(member.id);
      expect(responseData.data?.voteType).toBe('upvoted');
  
      // And it is a super upvote
      expect(responseData.data?.value).toBe(2);
      expect(responseData.data?.isSuperVote).toBe(true);
    });
  });
})