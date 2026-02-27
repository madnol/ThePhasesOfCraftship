import { ProductionVotesRepository } from "../adapters/productionVotesRepo";
import { PrismaDatabase } from "@dddforum/database";
import { Config } from "@dddforum/config";
import { EventOutboxTable } from "@dddforum/outbox";
import { Member } from "../../../members/domain/member";
import { MemberUsername } from "../../../members/domain/memberUsername";
import { ProductionMembersRepository } from "../../../members/repos/adapters/productionMembersRepository";
import { Comment } from "../../../comments/domain/comment";
import { ProductionCommentsRepository } from "../../../comments/repos/adapters/productionCommentRepository";
import { Post } from "../../../posts/domain/post";
import { ProductionPostsRepository } from "../../../posts/repos/adapters/productionPostsRepository";
import { CommentVote } from "../../domain/commentVote";
import { ApplicationErrors } from "@dddforum/errors/application";
import { randomUUID } from "node:crypto";

describe('voteRepository', () => {
  const config = Config();
  const database = new PrismaDatabase(config);
  const eventsTable = new EventOutboxTable(database);
  const memberRepo = new ProductionMembersRepository(database, eventsTable);
  const votesRepo = new ProductionVotesRepository(database, eventsTable);
  const commentRepo = new ProductionCommentsRepository(database, eventsTable);
  const postRepo = new ProductionPostsRepository(database, eventsTable);

  async function setupMemberWithSingleComment() {
    // Create member in member repo
    const member = Member.toDomain({
      id: randomUUID(),
      userId: randomUUID(),
      username: MemberUsername.toDomain(`testuser-${randomUUID()}`),
      reputationScore: 0,
      reputationLevel: 'Level1'
    });

    // Save member to repository
    await memberRepo.saveAggregateAndEvents(member, member.getDomainEvents());

    // Create a post
    const post = Post.create({
      memberId: member.id,
      title: 'Test Post',
      content: 'Test content',
      postType: 'text'
    });

    if (post instanceof ApplicationErrors.ValidationError) {
      throw new Error('Failed to create post');
    }

    // Save post to repository
    await postRepo.saveAggregateAndEvents(post, post.getDomainEvents());

    // Create a comment in the comment repo
    const comment = Comment.toDomain({
      id: randomUUID(),
      text: 'Test comment',
      postId: post.id,
      memberId: member.id,
      parentCommentId: null
    });

    // Save comment to repository
    await commentRepo.saveAggregateAndEvents(comment, comment.getDomainEvents());

    return { member, comment, post };
  }

  async function setupVotingMember(reputationLevel: 'Level1' | 'Level3', reputationScore: number, comment: Comment) {
    const member = Member.toDomain({
      id: randomUUID(),
      userId: randomUUID(),
      username: MemberUsername.toDomain(`voter-${randomUUID()}`),
      reputationScore,
      reputationLevel
    });

    await memberRepo.saveAggregateAndEvents(member, member.getDomainEvents());

    const vote = CommentVote.create(member.id, comment.id);

    if (vote instanceof ApplicationErrors.ValidationError) {
      throw new Error('Failed to create level vote');
    }

    vote.castVote('upvote', member)

    await votesRepo.saveAggregateAndEvents(vote, vote.getDomainEvents());
    return member;
  }

  describe('comment roundups', () => {
    test(`given a member has posted one comment, 
      and it was upvoted by a level 1 member with a reputation score of 3 which awards only 1 point,
      and it was upvoted by a level 3 member with a reputation score of 30 which awards 3 points,
      then the commentRoundup should return a score of 4 for the member`, async () => {
      
      // Setup the member who posted the comment
      const { member: commentOwner, comment } = await setupMemberWithSingleComment();

      // Setup the level 1 member who upvotes
      await setupVotingMember('Level1', 3, comment);
      
      // Setup the level 3 member who upvotes
      await setupVotingMember('Level3', 30, comment);

      // Get the roundup
      const roundup = await votesRepo.getMemberCommentVotesRoundup(commentOwner.id);

      // Verify the score
      expect(roundup.getScore()).toBe(4); // 1 point from level 1 + 3 points from level 3
    });
  });
});