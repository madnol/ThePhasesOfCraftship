import { CompositionRoot } from "../../../src/shared/compositionRoot";
import { Types as MemberTypes } from '@dddforum/api/members'
import { Inputs as PostInputs } from '@dddforum/api/posts'
import { Config } from '@dddforum/config'
import { createAPIClient } from "@dddforum/api";
import { setupPost } from "../../fixtures/e2e/posts";
import { createFakeAuthTokenAndUser } from "../../fixtures/e2e/users";
import { DatabaseFixture } from "../../fixtures/e2e/database";
import { setupLevel1Member, setupLevel2Member } from "../../fixtures/e2e/members";

jest.setTimeout(30000);

describe('posts', () => {

  let databaseFixture: DatabaseFixture;
    const apiClient = createAPIClient("http://localhost:3000");
    let appComposition: CompositionRoot;
    const config: Config = Config();

    beforeAll(async () => {
      appComposition = CompositionRoot.createCompositionRoot(config);
      databaseFixture = new DatabaseFixture(appComposition);
      await appComposition.start();
    });

    afterAll(async () => {
      await appComposition.stop();
    });

    describe('identity & permissions', () => {
      it('should not be able to create a post if they are level 1', async () => {
        // Implement
        throw new Error("Not yet implemented")
      });
  
    })

    describe ('creating new posts', () => {

      it ('as a level 2 member, it can create a link post', async () => {
        // Implement
        throw new Error("Not yet implemented")
      });

      it ('should have an initial upvote when creating a post', async () => {
        // Implement
        throw new Error("Not yet implemented")

      }, 15000); // Set test timeout to 15 seconds

      it ('cannot create a link post without supplying a link', async () => {
        // Implement
        throw new Error("Not yet implemented")
      });

      it ('cannot create a text post without supplying content', async () => {
        // Implement
        throw new Error("Not yet implemented")
      });
    });

    describe('fetching posts', () => {

      it ('can fetch a previously created post by id', async () => {
        // Implement
        throw new Error("Not yet implemented")
      });
    
      it ('returns a not found error if the post does not exist', async () => {
        // Implement
        throw new Error("Not yet implemented")
      });

      it('can fetch recent posts', () => {
        // Not yet implemented
        throw new Error("Not yet implemented")
      })

      it('can fetch "popular" posts', () => {
        // Not yet implemented
        throw new Error("Not yet implemented")
      })
    })

    describe('incentives for posting / membership updates', () => {
      it('should trigger a member reputation upgrade if the member posts 5 posts, going from level 2 to level 3', async () => {
        // Implement
        throw new Error("Not yet implemented")
      }, 20000);
    })
})