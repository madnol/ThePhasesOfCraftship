
import { PostComment } from "./postComment";
import { ProductionPostsRepository } from "../../../../posts/repos/adapters/productionPostsRepository";
import { PrismaDatabase } from "@dddforum/database";
import { Config } from "@dddforum/config";
import { InMemoryEventBus } from "@dddforum/bus";
import { Commands } from "@dddforum/api/comments";
import { ProductionMembersRepository } from "../../../../members/repos/adapters/productionMembersRepository";
import { ProductionCommentsRepository } from "../../../repos/adapters/productionCommentRepository";
import { setupTestWithLevel1Member } from '../../../../../../tests/fixtures/unit/members'
import { CommentPosted } from "../../../domain/commentPosted";
import { withExistingPostByRandomMember } from "../../../../../../tests/fixtures/unit/posts";
import { Comment } from "../../../domain/comment";

describe('postComment', () => {
  let config = Config();
  let database = new PrismaDatabase(config);
  let commentsRepo = new ProductionCommentsRepository(database);
  let postsRepo = new ProductionPostsRepository(database);
  let membersRepo = new ProductionMembersRepository(database);
  let eventBus = new InMemoryEventBus();
  const useCase = new PostComment(commentsRepo, postsRepo, membersRepo, eventBus);

  beforeEach(() => {
    jest.resetAllMocks();
  })

  describe('permissions & identity', () => {

    test('as a level 1 member, I should be able to post a comment', async () => {
      const level1Member = setupTestWithLevel1Member(useCase);
      const existingPost = withExistingPostByRandomMember(useCase);
      const saveSpy = jest.spyOn(useCase['commentRepo'], 'save').mockImplementation(async () => {});
      const eventBusSpy = jest.spyOn(eventBus, 'publishEvents').mockImplementation(async () => {});

      const command = Commands.PostCommentCommand.create({
        postId: existingPost.id,
        text: 'Test comment',
        memberId: level1Member.id
      });

      const response = await useCase.execute(command.getValue());

      expect(response.isSuccess()).toBe(true);
      expect(response.getValue() instanceof Comment).toBe(true);
      expect(saveSpy).toHaveBeenCalled();
      expect(eventBusSpy).toHaveBeenCalled();

      const publishedEvents = eventBusSpy.mock.calls[0][0];
      expect(publishedEvents).toBeDefined();
      expect(publishedEvents.length).toBeGreaterThan(0);

      const commentPostedEvent = publishedEvents[0] as CommentPosted;
      expect(commentPostedEvent).toBeInstanceOf(CommentPosted);
      
      expect(commentPostedEvent.commentId).toBe(response.getValue()!.id);
      expect(commentPostedEvent.postId).toBe(existingPost.id);
      expect(commentPostedEvent.memberId).toBe(level1Member.id);
    });
  });

  describe('posting comments', () => {
    test ('if the member does not exist, the comment should not be created', async () => {
      // Arrange
      useCase['memberRepository'].getMemberById = jest.fn().mockResolvedValue(null);
      const saveSpy = jest.spyOn(useCase['commentRepo'], 'save').mockImplementation(async () => {});
      const eventBusSpy = jest.spyOn(eventBus, 'publishEvents').mockImplementation(async () => {});

      const command = Commands.PostCommentCommand.create({
        postId: '8be25ac7-49ff-43be-9f22-3801e268e0bd',
        text: 'Test comment',
        memberId: 'fake-member-id'
      });

      const response = await useCase.execute(command.getValue());

      expect(response.isSuccess()).toBe(false);
      expect(response.getError().type).toEqual('NotFoundError');
      expect(saveSpy).not.toHaveBeenCalled();
      expect(eventBusSpy).not.toHaveBeenCalled();
    });

    test('if the post was not found, the comment should not be created', async () => {
      let level1Member = setupTestWithLevel1Member(useCase)
      useCase['postRepository'].getPostById = jest.fn().mockResolvedValue(null);
      const saveSpy = jest.spyOn(useCase['commentRepo'], 'save').mockImplementation(async () => {});
      const eventBusSpy = jest.spyOn(eventBus, 'publishEvents').mockImplementation(async () => {});

      const command = Commands.PostCommentCommand.create({
        postId: 'non-existent-id',
        text: 'Test comment',
        memberId: level1Member.id
      });

      const response = await useCase.execute(command.getValue());

      expect(response.isSuccess()).toBe(false);
      expect(response.getError().type).toEqual('NotFoundError');
      expect(saveSpy).not.toHaveBeenCalled();
      expect(eventBusSpy).not.toHaveBeenCalled();
    });

    test('successfully posting a comment in response to a post', () => {
      // Not yet implemented
    });
  })

  describe('comment validation', () => {
    test('should not allow empty comments', async () => {
      const level1Member = setupTestWithLevel1Member(useCase);
      const existingPost = withExistingPostByRandomMember(useCase);;

      const command = Commands.PostCommentCommand.create({
        postId: existingPost.id,
        text: '',
        memberId: level1Member.id
      });

      expect(command.isSuccess()).toBe(false);
    });

    test('should not allow comments exceeding 1000 characters', async () => {
      const level1Member = setupTestWithLevel1Member(useCase);
      const existingPost = withExistingPostByRandomMember(useCase);;

      const command = Commands.PostCommentCommand.create({
        postId: existingPost.id,
        text: 'a'.repeat(1001),
        memberId: level1Member.id
      });

      expect(command.isSuccess()).toBe(false);
    });
  });
});