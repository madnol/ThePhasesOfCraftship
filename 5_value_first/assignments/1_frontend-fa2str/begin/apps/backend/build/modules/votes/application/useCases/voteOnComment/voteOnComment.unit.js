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
const productionMembersRepository_1 = require("../../../../members/repos/adapters/productionMembersRepository");
const voteOnComment_1 = require("./voteOnComment");
const src_1 = require("@dddforum/errors/src");
const member_1 = require("../../../../members/domain/member");
const memberUsername_1 = require("../../../../members/domain/memberUsername");
const productionCommentRepository_1 = require("../../../../comments/repos/adapters/productionCommentRepository");
const productionVotesRepo_1 = require("../../../repos/adapters/productionVotesRepo");
const comment_1 = require("../../../../comments/domain/comment");
const commentVote_1 = require("../../../../comments/domain/commentVote");
const votes_1 = require("@dddforum/api/src/votes");
const src_2 = require("@dddforum/outbox/src");
let prisma = new client_1.PrismaClient();
let outboxTable = new src_2.EventOutboxTable(prisma);
let membersRepo = new productionMembersRepository_1.ProductionMembersRepository(prisma, outboxTable);
let commentsRepo = new productionCommentRepository_1.ProductionCommentsRepository(prisma);
let eventsTable = new src_2.EventOutboxTable(prisma);
let votesRepo = new productionVotesRepo_1.ProductionVotesRepository(prisma, eventsTable);
const useCase = new voteOnComment_1.VoteOnComment(membersRepo, commentsRepo, votesRepo);
function setupCommentAndMember(useCase, memberReputationLevel) {
    jest.resetAllMocks();
    let member = member_1.Member.toDomain({
        userId: '8be25ac7-49ff-43be-9f22-3811e268e0bd',
        username: memberUsername_1.MemberUsername.toDomain('jill'),
        reputationScore: 10,
        reputationLevel: memberReputationLevel,
        id: 'bf6b4773-feea-44cd-a951-f0ffd68625ea'
    });
    let comment = comment_1.Comment.toDomain({
        id: '83f91fd3-3e54-4d55-aa92-9027abd5310e',
        text: 'This is a comment',
        memberId: member.id,
        parentCommentId: null,
        postId: '2e348513-b2d7-449a-aed4-7b0050261e3e'
    });
    useCase['memberRepository'].getMemberById = jest.fn().mockResolvedValue(member);
    useCase['commentRepository'].getCommentById = jest.fn().mockResolvedValue(comment);
    return { member, comment };
}
function setupCommentVote(member, comment, state) {
    let commentVote = commentVote_1.CommentVote.toDomain({
        id: '6f2a5a6e-7f0f-4f3d-8c8b-9c0c6e2c2f8e',
        commentId: comment.id,
        memberId: member.id,
        voteState: state
    });
    useCase['voteRepository'].findVoteByMemberAndCommentId = jest.fn().mockResolvedValue(commentVote);
}
describe('voteOnComment', () => {
    describe('permissions & identity', () => {
        test('if the member was not found, they should not be able to vote on the comment', () => __awaiter(void 0, void 0, void 0, function* () {
            useCase['memberRepository'].getMemberById = jest.fn().mockResolvedValue(null);
            const saveSpy = jest.spyOn(useCase['voteRepository'], 'save');
            const command = new votes_1.Commands.VoteOnCommentCommand({
                commentId: 'non-existent-id',
                memberId: 'non-existent-id',
                voteType: 'upvote'
            });
            const response = yield useCase.execute(command);
            expect(response instanceof src_1.ApplicationErrors.NotFoundError).toBe(true);
            expect(response.name).toEqual('MemberNotFoundError');
            expect(saveSpy).not.toHaveBeenCalled();
        }));
        test('if the comment was not found, they should not be able to vote on the comment', () => __awaiter(void 0, void 0, void 0, function* () {
            useCase['commentRepository'].getCommentById = jest.fn().mockResolvedValue(null);
            useCase['memberRepository'].getMemberById = jest.fn().mockResolvedValue({});
            const saveSpy = jest.spyOn(useCase['voteRepository'], 'save');
            const command = new votes_1.Commands.VoteOnCommentCommand({
                commentId: 'non-existent-id',
                memberId: 'non-existent-id',
                voteType: 'upvote'
            });
            const response = yield useCase.execute(command);
            expect(response instanceof src_1.ApplicationErrors.NotFoundError).toBe(true);
            expect(response.name).toEqual('CommentNotFoundError');
            expect(saveSpy).not.toHaveBeenCalled();
        }));
        it.each([
            [member_1.MemberReputationLevel.Level1, src_1.ApplicationErrors.PermissionError],
            [member_1.MemberReputationLevel.Level2, commentVote_1.CommentVote]
        ])('as a %s member, I can cast a vote on a comment', (reputationLevel, result) => __awaiter(void 0, void 0, void 0, function* () {
            const { member } = setupCommentAndMember(useCase, reputationLevel);
            const command = new votes_1.Commands.VoteOnCommentCommand({
                commentId: 'existing-comment-id',
                memberId: member.id,
                voteType: 'upvote'
            });
            const response = yield useCase.execute(command);
            expect(response).toBeDefined();
            expect(response instanceof result).toBeTruthy();
        }));
    });
    describe('vote state', () => {
        test('as a level 2 member, when I upvote a comment I have not yet upvoted, the comment should be upvoted and an upvoted event should get dispatched', () => __awaiter(void 0, void 0, void 0, function* () {
            const { member, comment } = setupCommentAndMember(useCase, member_1.MemberReputationLevel.Level2);
            const saveSpy = jest.spyOn(useCase['voteRepository'], 'save');
            const command = new votes_1.Commands.VoteOnCommentCommand({
                commentId: comment.id,
                memberId: member.id,
                voteType: 'upvote'
            });
            const response = yield useCase.execute(command);
            expect(response).toBeDefined();
            expect(response instanceof commentVote_1.CommentVote).toBeTruthy();
            expect(response.getValue()).toEqual(1);
            expect(response.getDomainEvents()).toHaveLength(1);
            expect(response.getDomainEvents()[0].name).toEqual('CommentUpvoted');
            expect(saveSpy).toHaveBeenCalled();
            // expect(eventBusSpy).toHaveBeenCalled();
            // expect(eventBusSpy).toHaveBeenCalledWith(expect.arrayContaining([
            //   expect.objectContaining({ name: 'CommentUpvoted' })
            // ]));
        }));
        test('as a level 2 member, when I downvote a comment I have not yet downvoted, the comment should be downvoted and a downvoted event should get dispatched', () => __awaiter(void 0, void 0, void 0, function* () {
            const { member, comment } = setupCommentAndMember(useCase, member_1.MemberReputationLevel.Level2);
            setupCommentVote(member, comment, 'Default');
            const saveSpy = jest.spyOn(useCase['voteRepository'], 'save');
            const command = new votes_1.Commands.VoteOnCommentCommand({
                commentId: comment.id,
                memberId: member.id,
                voteType: 'downvote'
            });
            const response = yield useCase.execute(command);
            expect(response).toBeDefined();
            expect(response instanceof commentVote_1.CommentVote).toBeTruthy();
            expect(response.getValue()).toEqual(-1);
            expect(response.getDomainEvents()).toHaveLength(1);
            expect(response.getDomainEvents()[0].name).toEqual('CommentDownvoted');
            expect(saveSpy).toHaveBeenCalled();
            // expect(eventBusSpy).toHaveBeenCalled();
            // expect(eventBusSpy).toHaveBeenCalledWith(expect.arrayContaining([
            //   expect.objectContaining({ name: 'CommentDownvoted' })
            // ]));
        }));
        test('as a level 2 member, when I upvote a comment I have already upvoted, the comment should remain upvoted and no upvoted event should get dispatched', () => __awaiter(void 0, void 0, void 0, function* () {
            const { member, comment } = setupCommentAndMember(useCase, member_1.MemberReputationLevel.Level2);
            setupCommentVote(member, comment, 'Upvoted');
            const saveSpy = jest.spyOn(useCase['voteRepository'], 'save');
            const command = new votes_1.Commands.VoteOnCommentCommand({
                commentId: comment.id,
                memberId: member.id,
                voteType: 'upvote'
            });
            const response = yield useCase.execute(command);
            expect(response).toBeDefined();
            expect(response instanceof commentVote_1.CommentVote).toBeTruthy();
            expect(response.getValue()).toEqual(1);
            expect(response.getDomainEvents()).toHaveLength(0);
            expect(saveSpy).toHaveBeenCalled();
            // expect(eventBusSpy).toHaveBeenCalledWith([]);
        }));
        test('as a level 2 member, when I downvote a comment I have already downvoted, the comment should remain downvoted', () => __awaiter(void 0, void 0, void 0, function* () {
            const { member, comment } = setupCommentAndMember(useCase, member_1.MemberReputationLevel.Level2);
            setupCommentVote(member, comment, 'Downvoted');
            const saveSpy = jest.spyOn(useCase['voteRepository'], 'save');
            const command = new votes_1.Commands.VoteOnCommentCommand({
                commentId: comment.id,
                memberId: member.id,
                voteType: 'downvote'
            });
            const response = yield useCase.execute(command);
            expect(response).toBeDefined();
            expect(response instanceof commentVote_1.CommentVote).toBeTruthy();
            expect(response.getValue()).toEqual(-1);
            expect(saveSpy).toHaveBeenCalled();
        }));
    });
    describe('many existing comments vote score', () => {
        test('upvote existing: as a level 2 member, when I upvote a comment with existing votes that I have not yet upvoted, the comment score should get incremented', () => __awaiter(void 0, void 0, void 0, function* () {
            const { member, comment } = setupCommentAndMember(useCase, member_1.MemberReputationLevel.Level2);
            const saveSpy = jest.spyOn(useCase['voteRepository'], 'save');
            const command = new votes_1.Commands.VoteOnCommentCommand({
                commentId: comment.id,
                memberId: member.id,
                voteType: 'upvote'
            });
            const response = yield useCase.execute(command);
            expect(response).toBeDefined();
            expect(response instanceof commentVote_1.CommentVote).toBeTruthy();
            expect(saveSpy).toHaveBeenCalled();
        }));
        test('downvote existing: as a level 2 member, when I downvote a comment with existing votes that I have not yet downvoted, the comment score should get decremented', () => __awaiter(void 0, void 0, void 0, function* () {
            const { member, comment } = setupCommentAndMember(useCase, member_1.MemberReputationLevel.Level2);
            const saveSpy = jest.spyOn(useCase['voteRepository'], 'save');
            const command = new votes_1.Commands.VoteOnCommentCommand({
                commentId: comment.id,
                memberId: member.id,
                voteType: 'downvote'
            });
            const response = yield useCase.execute(command);
            expect(response).toBeDefined();
            expect(saveSpy).toHaveBeenCalled();
            // expect(eventBusSpy).toHaveBeenCalled();
            // expect(eventBusSpy).toHaveBeenCalledWith(expect.arrayContaining([
            //   expect.objectContaining({ name: 'CommentDownvoted' })
            // ]));
        }));
    });
});
