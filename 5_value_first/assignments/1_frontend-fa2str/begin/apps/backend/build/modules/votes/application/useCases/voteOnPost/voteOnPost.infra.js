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
const voteOnPost_1 = require("./voteOnPost");
const productionPostsRepository_1 = require("../../../../posts/repos/adapters/productionPostsRepository");
const productionVotesRepo_1 = require("../../../repos/adapters/productionVotesRepo");
const votesCommands_1 = require("../../../votesCommands");
const postVote_1 = require("../../../../posts/domain/postVote");
const member_1 = require("../../../../members/domain/member");
const post_1 = require("../../../../posts/domain/post");
const crypto_1 = require("crypto");
const src_1 = require("@dddforum/core/src");
const src_2 = require("@dddforum/outbox/src");
describe('voteOnPost', () => {
    const prisma = new client_1.PrismaClient();
    const eventsTable = new src_2.EventOutboxTable(prisma);
    const memberRepository = new productionMembersRepository_1.ProductionMembersRepository(prisma, eventsTable);
    const postRepository = new productionPostsRepository_1.ProductionPostsRepository(prisma, eventsTable);
    const voteRepository = new productionVotesRepo_1.ProductionVotesRepository(prisma, eventsTable);
    const useCase = new voteOnPost_1.VoteOnPost(memberRepository, postRepository, voteRepository);
    function setupTest() {
        return __awaiter(this, void 0, void 0, function* () {
            const originalPostOwner = member_1.Member.toDomain({
                id: (0, crypto_1.randomUUID)(),
                userId: (0, crypto_1.randomUUID)(),
                username: `billybob-${src_1.TextUtil.createRandomText(5)}`,
                reputationScore: 25,
                reputationLevel: member_1.MemberReputationLevel.Level2,
                dateCreated: new Date(),
                lastUpdated: new Date()
            });
            const member = member_1.Member.toDomain({
                id: (0, crypto_1.randomUUID)(),
                userId: (0, crypto_1.randomUUID)(),
                username: `jill-${src_1.TextUtil.createRandomText(5)}`,
                reputationScore: 21,
                reputationLevel: member_1.MemberReputationLevel.Level2,
                dateCreated: new Date(),
                lastUpdated: new Date()
            });
            const post = post_1.Post.toDomain({
                id: (0, crypto_1.randomUUID)(),
                title: 'test',
                content: 'This is a post that we are using for testing! Posted by billybob',
                memberId: originalPostOwner.id,
                dateCreated: new Date(),
                lastUpdated: new Date(),
                voteScore: 10,
                postType: 'text', // or the appropriate post type
                link: null // or the appropriate link value
            });
            yield memberRepository.save(originalPostOwner);
            yield memberRepository.save(member);
            yield postRepository.save(post);
            return { member, post };
        });
    }
    it('should be able to cast an upvote', () => __awaiter(void 0, void 0, void 0, function* () {
        const { member, post } = yield setupTest();
        const command = new votesCommands_1.VoteOnPostCommand({ memberId: member.id, postId: post.id, voteType: 'upvote' });
        const response = yield useCase.execute(command);
        // Post use case response
        expect(response).toBeInstanceOf(postVote_1.PostVote);
        expect(response.getValue().memberId).toBe(member.id);
        expect(response.getValue().postId).toBe(post.id);
        // Domain event saved
        const aggregateId = response.getValue().id;
        const eventsFromTable = yield eventsTable.getEventsByAggregateId(aggregateId);
        expect(eventsFromTable.length).toBe(1);
        expect(eventsFromTable[0].name).toBe('PostUpvoted');
        const event = eventsFromTable[0];
        expect(event.aggregateId).toBe(aggregateId);
        expect(event.data.postVoteId).toBe(aggregateId);
        expect(event.data.postId).toBe(post.id);
        expect(event.data.memberId).toBe(member.id);
    }));
    it('should be able to cast an downvote', () => __awaiter(void 0, void 0, void 0, function* () {
        const { member, post } = yield setupTest();
        const command = new votesCommands_1.VoteOnPostCommand({ memberId: member.id, postId: post.id, voteType: 'downvote' });
        const response = yield useCase.execute(command);
        // Post use case response
        expect(response).toBeInstanceOf(postVote_1.PostVote);
        expect(response.getValue().memberId).toBe(member.id);
        expect(response.getValue().postId).toBe(post.id);
        // Domain event saved
        const aggregateId = response.getValue().id;
        const eventsFromTable = yield eventsTable.getEventsByAggregateId(aggregateId);
        expect(eventsFromTable.length).toBe(1);
        expect(eventsFromTable[0].name).toBe('PostDownvoted');
        const event = eventsFromTable[0];
        expect(event.aggregateId).toBe(aggregateId);
        expect(event.data.postVoteId).toBe(aggregateId);
        expect(event.data.postId).toBe(post.id);
        expect(event.data.memberId).toBe(member.id);
    }));
});
