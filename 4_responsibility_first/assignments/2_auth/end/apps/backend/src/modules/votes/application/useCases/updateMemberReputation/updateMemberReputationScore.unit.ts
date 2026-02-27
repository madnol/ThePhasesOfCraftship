import { UpdateMemberReputationScore } from "./updateMemberReputationScore";
import { MemberCommentVotesRoundup } from "../../../../votes/domain/memberCommentVotesRoundup";
import { MemberPostVotesRoundup } from "../../../../votes/domain/memberPostVotesRoundup";
import { ProductionVotesRepository } from "../../../../votes/repos/adapters/productionVotesRepo";
import { MemberUsername } from "../../../../members/domain/memberUsername";
import { Member } from "../../../../members/domain/member";
import { ProductionMembersRepository } from "../../../../members/repos/adapters/productionMembersRepository";
import { randomUUID } from "crypto";
import { PrismaDatabase } from "@dddforum/database";
import { Config } from "@dddforum/config";
import { InMemoryEventBus } from "@dddforum/bus";
import { Commands } from "@dddforum/api/votes";
import { Types } from "@dddforum/api/members";
import { EventOutboxTable } from "@dddforum/outbox";

function setupTest({ 
  useCase, 
  commentVotes, 
  postVotes, 
  member: { reputationLevel, reputationScore } 
}: { 
  useCase: UpdateMemberReputationScore, 
  commentVotes: { upvotes: number, downvotes: number, count: number, }, 
  postVotes: { upvotes: number, downvotes: number, count: number }, 
  member: { reputationLevel: Types.ReputationLevel, reputationScore: number } 
}) {
  jest.resetAllMocks();

  let member = Member.toDomain({
    userId: randomUUID(),
    username: MemberUsername.toDomain('jill1234'),
    reputationScore,
    reputationLevel,
    id: randomUUID()
  });

  let commentVotesRoundup = MemberCommentVotesRoundup.toDomain({
    allCommentsCount: commentVotes.count,
    upvotesCount: commentVotes.upvotes,
    downvotesCount: commentVotes.downvotes,
    memberId: member.id
  });

  let postVotesRoundup = MemberPostVotesRoundup.toDomain({
    allPostsCount: postVotes.count,
    downvotesCount: postVotes.downvotes,
    upvotesCount: postVotes.upvotes,
    memberId: member.id
  });

  useCase['memberRepository'].getMemberById = jest.fn().mockResolvedValue(member);
  useCase['votesRepository'].getMemberPostVotesRoundup = jest.fn().mockResolvedValue(postVotesRoundup);
  useCase['votesRepository'].getMemberCommentVotesRoundup = jest.fn().mockResolvedValue(commentVotesRoundup);

  return { member, commentVotesRoundup, postVotesRoundup }
}

describe('updateMemberReputationScore', () => {

  let config = Config();
  let database = new PrismaDatabase(config);
  let outboxTable = new EventOutboxTable(database);
  let membersRepo = new ProductionMembersRepository(database, outboxTable);
  let votesRepo = new ProductionVotesRepository(database, outboxTable);

  const useCase = new UpdateMemberReputationScore(membersRepo, votesRepo);

  describe('update with reputation level upgrade', () => {
    test(`
      given a level 1 member has an existing reputation score of 0,
      and they have posted 6 comments,
      when we update the member reputation score
      then the member should have a reputation score of 6`, async () => {

      const { member } = setupTest({
        useCase,
        commentVotes: { upvotes: 6, downvotes: 0, count: 6 },
        postVotes: { upvotes: 0, downvotes: 0, count: 0, },
        member: {
          reputationLevel: Types.ReputationLevel.Level1,
          reputationScore: 0
        }
      });
  
      const saveSpy = jest.spyOn(useCase['memberRepository'], 'saveAggregateAndEvents').mockImplementation(async () => {});
  
      const command = new Commands.UpdateMemberReputationScoreCommand({
        memberId: member.id,
      });
  
      let response = await useCase.execute(command);
  
      expect(response.isSuccess()).toBe(true);
      const updatedMember = response.getValue();
      expect(updatedMember.reputationScore).toBe(6);
      expect(updatedMember.reputationLevel).toBe(Types.ReputationLevel.Level2);
      expect(updatedMember.getDomainEvents().length).toBe(1);
      expect(updatedMember.getDomainEvents()[0].name).toBe('MemberReputationLevelUpgraded');
      expect(saveSpy).toHaveBeenCalledTimes(1);
    });
  });
});
