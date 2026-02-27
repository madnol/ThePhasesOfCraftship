
import { CreatePost } from "./createPost";
import { ProductionMembersRepository } from "../../../../members/repos/adapters/productionMembersRepository";
import { ProductionPostsRepository } from "../../../repos/adapters/productionPostsRepository";
import { Post } from "../../../domain/post";
import { PostCreated } from "../../../domain/postCreated";
import { PrismaDatabase } from "@dddforum/database";
import { Config } from "@dddforum/config";
import { InMemoryEventBus } from "@dddforum/bus";
import { Commands } from "@dddforum/api/posts";

import { 
  setupTestWithLevel1Member, 
  setupTestWithLevel2Member 
} from '../../../../../../tests/fixtures/unit/members'
import { EventOutboxTable } from "@dddforum/outbox";

describe ('createPost', () => {

  let config = Config()
  let database = new PrismaDatabase(config);
  let outbox = new EventOutboxTable(database);
  let membersRepo = new ProductionMembersRepository(database, outbox);
  let postsRepo = new ProductionPostsRepository(database, outbox);
  
  
  const useCase = new CreatePost(postsRepo, membersRepo);

  describe('permissions & identity', () => {

    test('as a level 1 member, I should not be able to create a new post', async () => {
      const member = setupTestWithLevel1Member(useCase);
      const outboxSpy = jest.spyOn(outbox, 'save').mockImplementation(async () => {});

      const commandOrError = Commands.CreatePostCommand.create({
        title: 'A new post',
        postType: 'text',
        content: 'This is a new post',
        memberId: member.id
      });

      expect(commandOrError.isSuccess()).toBe(true);
      
      const response = await useCase.execute(commandOrError.getValue());
  
      expect(response.isSuccess()).toBe(false);
      expect(response.getError().type).toBe("PermissionError");
      expect(outboxSpy).not.toHaveBeenCalled();
    });

    test('if the member was not found, they should not be able to create the post', async () => {

      useCase['memberRepository'].getMemberById = jest.fn().mockResolvedValue(null);
      const saveSpy = jest.spyOn(useCase['memberRepository'], 'save').mockImplementation(async () => {});
      const outboxSpy = jest.spyOn(outbox, 'save').mockImplementation(async () => {});

      const command = Commands.CreatePostCommand.create({
        title: 'A new post',
        postType: 'text',
        content: 'This is a new post',
        memberId: 'non-existent-id'
      });
      
      const response = await useCase.execute(command.getValue());

      expect(response.isSuccess()).toBe(false);
      expect(response.getError().type).toEqual('NotFoundError');
      expect(saveSpy).not.toHaveBeenCalled();
      expect(outboxSpy).not.toHaveBeenCalled();
    });
  
    

    test('as a level 2 member, I should be able to create a new post', async () => {

      const level2Member = setupTestWithLevel2Member(useCase);

      const saveSpy = jest.spyOn(useCase['postRepository'], 'save').mockImplementation(async () => {});
      const outboxSpy = jest.spyOn(outbox, 'save').mockImplementation(async () => {});

      const command = Commands.CreatePostCommand.create({
        title: 'A new post',
        postType: 'text',
        content: 'This is a new post',
        memberId: level2Member.id
      });
      
      const response = await useCase.execute(command.getValue());
  
      expect(response.isSuccess()).toBe(true);
      expect(response.getValue() instanceof Post).toBe(true);
      expect(saveSpy).toHaveBeenCalled();
      expect(outboxSpy).toHaveBeenCalled();

      const publishedEvents = outboxSpy.mock.calls[0][0];
      expect(publishedEvents).toBeDefined();
      expect(publishedEvents.length).toBeGreaterThan(0);

      const postCreatedEvent = publishedEvents[0]! as PostCreated;
      expect(postCreatedEvent).toBeInstanceOf(PostCreated);
      expect(postCreatedEvent.postId).toBe(response.getValue()!.id);
      expect(postCreatedEvent.memberId).toBe(level2Member.id);
    });
  });

  describe('text posts', () => {
    test ('as a level 2 member, I should be able to create a new text post with valid post details', async () => {

      const level2Member = setupTestWithLevel2Member(useCase);
      const saveSpy = jest.spyOn(useCase['postRepository'], 'save').mockImplementation(async () => {});
      const eventBusSpy = jest.spyOn(outbox, 'save').mockImplementation(async () => {});

      const command = Commands.CreatePostCommand.create({
        title: 'A new post',
        postType: 'text',
        content: 'This is a new post',
        memberId: level2Member.id
      });
      
      const response = await useCase.execute(command.getValue());

      expect(response.isSuccess()).toBe(true);
      expect(response.getValue() instanceof Post).toBe(true);

      const post = response.getValue() as Post;
      expect(post.title).toEqual('A new post');
      expect(saveSpy).toHaveBeenCalled();
      expect(eventBusSpy).toHaveBeenCalled();

      const publishedEvents = eventBusSpy.mock.calls[0][0];
      expect(publishedEvents).toBeDefined();
      expect(publishedEvents.length).toBeGreaterThan(0);

      const postCreatedEvent = publishedEvents[0]! as PostCreated;
      expect(postCreatedEvent).toBeInstanceOf(PostCreated);
      expect(postCreatedEvent.postId).toBe(post.id);
      expect(postCreatedEvent.memberId).toBe(level2Member.id);
    });
  
    test.each([
      { title: '', content: '' },
      { title: 'A', content: 'sdsd' },
      { title: 'Title! Looks good. But no content.', content: '' },
      { title: 'Another', content: '2' }
    ])('as a level 2 member, I should not be able to create a text post with invalid title or content: %o', async ({ title, content }) => {

      const level2Member = setupTestWithLevel2Member(useCase);

      const command = Commands.CreatePostCommand.create({
        title,
        postType: 'text',
        content,
        memberId: level2Member.id
      });
      
      expect(command.isFailure()).toBe(true);
    });
  })

  describe('link posts', () => {
    test('as a level 2 member, I should be able to create a new link post with valid post details', async () => {

      const level2Member = setupTestWithLevel2Member(useCase);
      const saveSpy = jest.spyOn(useCase['postRepository'], 'save').mockImplementation(async () => {});
      const outboxSpy = jest.spyOn(outbox, 'save').mockImplementation(async () => {});

      const command = Commands.CreatePostCommand.create({
        title: 'A new post',
        postType: 'link',
        link: 'https://www.google.com',
        memberId: level2Member.id
      });
      
      const response = await useCase.execute(command.getValue());

      expect(response.isSuccess()).toBe(true);
      expect(response.getValue() instanceof Post).toBe(true);

      const post = response.getValue() as Post;
      expect(post.title).toEqual('A new post');
      expect(post.link).toEqual('https://www.google.com');
      expect(saveSpy).toHaveBeenCalled();
      expect(outboxSpy).toHaveBeenCalled();

      const publishedEvents = outboxSpy.mock.calls[0][0];
      expect(publishedEvents).toBeDefined();
      expect(publishedEvents.length).toBeGreaterThan(0);

      const postCreatedEvent = publishedEvents[0]! as PostCreated;
      expect(postCreatedEvent).toBeInstanceOf(PostCreated);
      expect(postCreatedEvent.postId).toBe(post.id);
      expect(postCreatedEvent.memberId).toBe(level2Member.id);
    });

    test.each([
      { title: 'A new post', link: '' },
      { title: 'A new post', link: 'invalid-url' },
      { title: 'A new post', link: 'www.google.com' } // Assuming the link should be a full URL with http/https
    ])('as a level 2 member, I should not be able to create a link post with an invalid link: %o', async ({ title, link }) => {

      const level2Member = setupTestWithLevel2Member(useCase);

      const command = Commands.CreatePostCommand.create({
        title,
        postType: 'link',
        link,
        memberId: level2Member.id
      });

      expect(command.isFailure()).toBe(true);
    });
  });

  describe('default votes', () => {
    test('as a level 2 member, when creating a new post, the post should have 1 upvote by me', async () => {
      // We can only test this in the integration test, because the vote is created in the domain event
    });
  })

})
