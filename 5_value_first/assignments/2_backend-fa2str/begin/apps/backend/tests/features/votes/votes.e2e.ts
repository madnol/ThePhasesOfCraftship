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
    test('Given I am a level 3 user with a reputation score of 16, when I upvote an existing comment, the value of my comment should be worth 2 points', async () => {
      // To be implemented
      throw new Error('Not yet implemented')
    });
  })
})