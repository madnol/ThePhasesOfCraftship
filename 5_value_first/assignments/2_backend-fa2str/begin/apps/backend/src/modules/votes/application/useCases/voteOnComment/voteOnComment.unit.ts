import { ProductionMembersRepository } from "../../../../members/repos/adapters/productionMembersRepository";
import { VoteOnComment } from "./voteOnComment";
import { Member } from "../../../../members/domain/member";
import { MemberUsername } from "../../../../members/domain/memberUsername";
import { ProductionCommentsRepository } from "../../../../comments/repos/adapters/productionCommentRepository";
import { ProductionVotesRepository } from "../../../repos/adapters/productionVotesRepo";
import { Comment } from "../../../../comments/domain/comment";
import { Commands } from '@dddforum/api/votes'
import { EventOutboxTable } from "@dddforum/outbox";
import { PrismaDatabase } from "@dddforum/database";
import { Config } from "@dddforum/config";
import { CommentVote } from "../../../domain/commentVote";
import { VoteState } from "../../../domain/voteState";
import { Types } from "@dddforum/api/members";

let config = Config();
let database = new PrismaDatabase(config);
let outboxTable = new EventOutboxTable(database);
let membersRepo = new ProductionMembersRepository(database, outboxTable);
let commentsRepo = new ProductionCommentsRepository(database, outboxTable);
let eventsTable = new EventOutboxTable(database);
let votesRepo = new ProductionVotesRepository(database, eventsTable);

const useCase = new VoteOnComment(membersRepo, commentsRepo, votesRepo);

function setupCommentAndMember (
  useCase: VoteOnComment, 
  memberReputationLevel: Types.ReputationLevel,
  reputationScore: number = 10
) {
  jest.resetAllMocks();

  let member = Member.toDomain({
    userId: '8be25ac7-49ff-43be-9f22-3811e268e0bd',
    username: MemberUsername.toDomain('jill'),
    reputationScore: reputationScore,
    reputationLevel: memberReputationLevel,
    id: 'bf6b4773-feea-44cd-a951-f0ffd68625ea'
  });

  let comment = Comment.toDomain({
    id: '83f91fd3-3e54-4d55-aa92-9027abd5310e',
    text: 'This is a comment',
    memberId: member.id,
    parentCommentId: null,
    postId: '2e348513-b2d7-449a-aed4-7b0050261e3e',
    voteScore: 1,
    dateCreated: new Date(),
    lastUpdated: new Date()
  });

  useCase['memberRepository'].getMemberById = jest.fn().mockResolvedValue(member);
  useCase['commentRepo'].getCommentById = jest.fn().mockResolvedValue(comment);
  
  return {member, comment};
}

function setupCommentVote (member: Member, comment: Comment, state: VoteState) {
  let commentVote = CommentVote.toDomain({
    id: '6f2a5a6e-7f0f-4f3d-8c8b-9c0c6e2c2f8e',
    commentId: comment.id,
    memberId: member.id,
    voteState: state
  });

  useCase['voteRepository'].findVoteByMemberAndCommentId = jest.fn().mockResolvedValue(commentVote);
}

describe('voteOnComment', () => {

  describe('permissions & identity', () => {
    test('if the member was not found, they should not be able to vote on the comment', async () => {

    });

    test('if the comment was not found, they should not be able to vote on the comment', async () => {

    });

    it.each([
      ['Level2' as const, true],
      ['Level3' as const, true]
    ])('as a %s member, I can cast a vote on a comment', async (reputationLevel, success) => {

    });
  });

  describe ('vote state', () => {
    test('as a level 2 member, when I upvote a comment I have not yet upvoted, the comment should be upvoted and an upvoted event should get dispatched', async () => {
 
    });

    test('as a level 2 member, when I downvote a comment I have not yet downvoted, the comment should be downvoted and a downvoted event should get dispatched', async () => {

    });

    test('as a level 2 member, when I upvote a comment I have already upvoted, the comment should remain upvoted and no upvoted event should get dispatched', async () => {

    });

    test('as a level 2 member, when I downvote a comment I have already downvoted, the comment should remain downvoted', async () => {

    });
  });

  describe ('tallying votes', () => {

    test('upvote existing: as a level 2 member, when I upvote a comment with existing votes that I have not yet upvoted, the comment score should get incremented', async () => {

    });

    test('downvote existing: as a level 2 member, when I downvote a comment with existing votes that I have not yet downvoted, the comment score should get decremented', async () => {

    });
  });

  describe('superVotes', () => {

    test(`Given I am a level 3 user with a reputation score of 34, when I upvote an existing comment, the value of my comment should be worth 3 points`, async () => {

    });

    test(`Given I am a level 3 user with a reputation score of 38, when I upvote an existing comment, the value of my comment should be worth 4 points`, async () => {
  
    })

    test(`Given I am a level 3 user with a reputation score of 22, when I upvote an existing comment, the value of my comment should be worth 2 points`, async () => {

    })

  });
  
})
