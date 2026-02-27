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
        const { token, userId } = await createFakeAuthTokenAndUser();
        const { member } = await setupLevel1Member(apiClient, token, userId);
        
        let postData: PostInputs.CreatePostInput = {
          memberId: member.memberId,
          title: 'My first post',
          postType: "text",
          content: 'This is my first post! I hope you like it!',
        };
  
        let response = await apiClient.posts.create(postData, token);
        console.log(response);
  
        expect(response).toBeDefined();
        expect(response.success).toBe(false);
        expect(response.error?.code).toBeDefined();
        expect(response.error?.code).toEqual(403);
        expect(response.error?.message).toEqual('PermissionError');
      });
  
    })

    describe ('creating new posts', () => {

      it.only ('as a level 2 member, it can create a link post', async () => {
        const { token, userId } = await createFakeAuthTokenAndUser();
        const { member } = await setupLevel2Member(apiClient, token, userId, databaseFixture);

        let postData: PostInputs.CreatePostInput = {
          memberId: member.memberId,
          title: 'Check out this site',
          postType: 'link',
          link: 'https://khalilstemmler.com'
        };
        let response = await apiClient.posts.create(postData, token);

        // Wait longer for event processing and eventual consistency
        await new Promise(resolve => setTimeout(resolve, 10000));

        expect(response).toBeDefined();
        console.log(response);
        expect(response.success).toBe(true);
        expect(response.data?.title).toBe(postData.title);
        expect(response.data?.postType).toBe(postData.postType);
        expect(response.data?.content).toBe(postData.content);
      });

      it ('should have an initial upvote when creating a post', async () => {
        const { token, userId } = await createFakeAuthTokenAndUser();
        const { member } = await setupLevel2Member(apiClient, token, userId, databaseFixture);
      
        let postData: PostInputs.CreatePostInput = {
          memberId: member.memberId,
          title: 'My first post',
          postType: "text",
          content: 'This is my first post! I hope you like it!'
        };

        let response = await apiClient.posts.create(postData, token);

        expect(response).toBeDefined();
        expect(response.success).toBe(true);
        expect(response.data?.title).toBe(postData.title);
        expect(response.data?.postType).toBe(postData.postType);
        expect(response.data?.content).toBe(postData.content);
        
        // Wait for event processing and eventual consistency
        await new Promise(resolve => setTimeout(resolve, 3000));

        let getPostResponse = await apiClient.posts.getPostById(response.data?.id as string);
        expect(getPostResponse.success).toBe(true);
        expect(getPostResponse.data?.title).toBe(postData.title);
        expect(getPostResponse.data?.postType).toBe(postData.postType);
        expect(getPostResponse.data?.content).toBe(postData.content);
        expect(getPostResponse.data?.voteScore).toBe(1);
      }, 15000); // Increase test timeout to 15 seconds

      it ('cannot create a link post without supplying a link', async () => {
        const { token, userId } = await createFakeAuthTokenAndUser();
        const { member } = await setupLevel2Member(apiClient, token, userId, databaseFixture);

        let postData: PostInputs.CreatePostInput = {
          memberId: member.memberId,
          title: 'Check out this site',
          postType: 'link',
          link: ''
        };
        let response = await apiClient.posts.create(postData, token);
        expect(response).toBeDefined();
        expect(response.success).toBe(false);
        expect(response.error).toBeDefined();
        expect(response.error?.code).toBeDefined();
        expect(response.error?.code).toEqual(400);
        expect(response.error?.message).toEqual('Invalid url');
      });

      it ('cannot create a text post without supplying content', async () => {
        const { token, userId } = await createFakeAuthTokenAndUser();
        const { member } = await setupLevel2Member(apiClient, token, userId, databaseFixture);

        let postData: PostInputs.CreatePostInput = {
          memberId: member.memberId,
          title: 'A new post',
          postType: "text",
          content: ''
        };
        let response = await apiClient.posts.create(postData, token);

        expect(response).toBeDefined();
        expect(response.success).toBe(false);
        expect(response.error).toBeDefined();
      });
    });

    describe('fetching posts', () => {

      it ('can fetch a previously created post by id', async () => {
        const { token, userId } = await createFakeAuthTokenAndUser();
        const { member } = await setupLevel2Member(apiClient, token, userId, databaseFixture);
        const { post } = await setupPost(apiClient, member, token);
    
        let response = await apiClient.posts.getPostById(post.id);
  
        expect(response).toBeDefined();
        expect(response.success).toBe(true);
        expect(response.data).toBeDefined();
      });
    
      it ('returns a not found error if the post does not exist', async () => {
        let response = await apiClient.posts.getPostById('non-existent-id');
  
        expect(response).toBeDefined();
        expect(response.success).toBe(false);
        expect(response.error).toBeDefined();
      });

      it('can fetch recent posts', () => {
        // Not yet implemented
      })

      it('can fetch "popular" posts', () => {
        // Not yet implemented
      })
    })

    describe('incentives for posting / membership updates', () => {
      it('should trigger a member reputation upgrade if the member posts 5 posts, going from level 2 to level 3', async () => {
        const { token, userId } = await createFakeAuthTokenAndUser();
        const { member } = await setupLevel2Member(apiClient, token, userId, databaseFixture);
  
        // Create 5 posts
        for (let i = 0; i < 5; i++) {
          const createPostInput: PostInputs.CreatePostInput = {
            title: `Test Post ${i + 1}`,
            postType: 'text',
            content: `This is test post ${i + 1}`,
            memberId: member.memberId
          };
  
          const response = await apiClient.posts.create(createPostInput, token);
  
          expect(response).toBeDefined();
          expect(response.success).toBe(true);
        }
  
        // Wait for eventual consistency
        await new Promise(resolve => setTimeout(resolve, 5000));
  
        // Get the member's updated state
        let updatedMember = await databaseFixture.getMemberById(member.memberId);
        console.log(updatedMember)
        expect(updatedMember).toBeDefined();
        expect(updatedMember?.reputationLevel).toBe(MemberTypes.ReputationLevel.Level3);
      }, 20000);
    })
})