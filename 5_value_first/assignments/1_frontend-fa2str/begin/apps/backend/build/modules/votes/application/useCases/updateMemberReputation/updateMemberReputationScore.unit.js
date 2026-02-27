"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const updateMemberReputationScore_1 = require("./updateMemberReputationScore");
const memberCommentVotesRoundup_1 = require("../../../../votes/domain/memberCommentVotesRoundup");
const memberPostVotesRoundup_1 = require("../../../../votes/domain/memberPostVotesRoundup");
const productionVotesRepo_1 = require("../../../../votes/repos/adapters/productionVotesRepo");
const memberUsername_1 = require("../../../../members/domain/memberUsername");
const votesCommands_1 = require("../../../votesCommands");
const member_1 = require("../../../../members/domain/member");
const productionMembersRepository_1 = require("../../../../members/repos/adapters/productionMembersRepository");
const src_1 = require("@dddforum/outbox/src");
function setupTest(useCase, initialReputationScore, commentVotes, postVotes) {
    jest.resetAllMocks();
    let member = member_1.Member.toDomain({
        userId: '8be25ac7-49ff-43be-9f22-3811e268e0bd',
        username: memberUsername_1.MemberUsername.toDomain('jill'),
        reputationScore: initialReputationScore,
        reputationLevel: initialReputationScore >= 10 ? member_1.MemberReputationLevel.Level2 : member_1.MemberReputationLevel.Level1,
        id: 'bf6b4773-feea-44cd-a951-f0ffd68625ea'
    });
    let commentVotesRoundup = memberCommentVotesRoundup_1.MemberCommentVotesRoundup.toDomain({
        allCommentsCount: commentVotes.upvotes + commentVotes.downvotes,
        allCommentsUpvoteCount: commentVotes.upvotes,
        allCommentsDownvoteCount: commentVotes.downvotes,
        memberId: member.id
    });
    let postVotesRoundup = memberPostVotesRoundup_1.MemberPostVotesRoundup.toDomain({
        allPostsCount: postVotes.upvotes + postVotes.downvotes,
        allPostsDownvoteCount: postVotes.downvotes,
        allPostsUpvoteCount: postVotes.upvotes,
        memberId: member.id
    });
    useCase['memberRepository'].getMemberById = jest.fn().mockResolvedValue(member);
    useCase['votesRepository'].getMemberPostVotesRoundup = jest.fn().mockResolvedValue(postVotesRoundup);
    useCase['votesRepository'].getMemberCommentVotesRoundup = jest.fn().mockResolvedValue(commentVotesRoundup);
    return { member, commentVotesRoundup, postVotesRoundup };
}
describe('updateMemberReputationScore', () => {
    let prisma = new client_1.PrismaClient();
    let eventsTable = new src_1.EventOutboxTable(prisma);
    let membersRepo = new productionMembersRepository_1.ProductionMembersRepository(prisma, eventsTable);
    let votesRepo = new productionVotesRepo_1.ProductionVotesRepository(prisma, eventsTable);
    const useCase = new updateMemberReputationScore_1.UpdateMemberReputationScore(membersRepo, votesRepo);
    describe('reputation score', () => {
        test(`
      given a level 1 member exists,
      and they have posted two new comments each with an upvote and no downvotes,
      when we update the member reputation score
      then the member should have a reputation score of 2`, () => __awaiter(void 0, void 0, void 0, function* () {
            const { member } = setupTest(useCase, 0, { upvotes: 2, downvotes: 0 }, { upvotes: 0, downvotes: 0 });
            const saveSpy = jest.spyOn(useCase['memberRepository'], 'save').mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () { }));
            const command = new votesCommands_1.UpdateMemberReputationScoreCommand({
                memberId: member.id,
            });
            let response = yield useCase.execute(command);
            expect(response instanceof member_1.Member).toBe(true);
            expect(response.reputationScore).toBe(2);
            expect(response.reputationLevel).toBe(member_1.MemberReputationLevel.Level1);
            expect(response.getDomainEvents().length).toBe(0);
            expect(saveSpy).toHaveBeenCalledTimes(1);
        }));
    });
    describe('with reputation level upgrade', () => {
        test.only(`
      given a level 1 member has an existing reputation score of 0,
      and they have posted 7 new comments each with an upvote and no downvotes,
      when we update the member reputation score
      then the member should have a reputation score of 7
      and the member should be upgraded to level 2`, () => __awaiter(void 0, void 0, void 0, function* () {
            const { member } = setupTest(useCase, 0, { upvotes: 7, downvotes: 0 }, { upvotes: 0, downvotes: 0 });
            const saveSpy = jest.spyOn(useCase['memberRepository'], 'save').mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () { }));
            const command = new votesCommands_1.UpdateMemberReputationScoreCommand({
                memberId: member.id,
            });
            let response = yield useCase.execute(command);
            expect(response instanceof member_1.Member).toBe(true);
            expect(response.reputationScore).toBe(7);
            expect(response.reputationLevel).toBe(member_1.MemberReputationLevel.Level2);
            expect(response.getDomainEvents().length).toBe(1);
            expect(response.getDomainEvents()[0].constructor.name).toBe('MemberReputationLevelUpgraded');
            expect(saveSpy).toHaveBeenCalledTimes(1);
        }));
    });
});
