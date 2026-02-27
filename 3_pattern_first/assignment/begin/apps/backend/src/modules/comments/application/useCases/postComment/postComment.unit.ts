
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
      // Implement
      throw new Error("Not yet implemented")
    });
  });

  describe('posting comments', () => {
    test ('if the member does not exist, the comment should not be created', async () => {
      // Implement
      throw new Error("Not yet implemented")
    });

    test('if the post was not found, the comment should not be created', async () => {
      // Implement
      throw new Error("Not yet implemented")
    });
  })

  describe('comment validation', () => {
    test('should not allow empty comments', async () => {
      // Implement
      throw new Error("Not yet implemented")
    });

    test('should not allow comments exceeding 1000 characters', async () => {
      // Implement
      throw new Error("Not yet implemented")
    });
  });
});