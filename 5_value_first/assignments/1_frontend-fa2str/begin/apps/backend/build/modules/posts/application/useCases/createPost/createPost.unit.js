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
const member_1 = require("../../../../members/domain/member");
const createPost_1 = require("./createPost");
const productionMembersRepository_1 = require("../../../../members/repos/adapters/productionMembersRepository");
const productionPostsRepository_1 = require("../../../repos/adapters/productionPostsRepository");
const postsCommands_1 = require("../../../postsCommands");
const src_1 = require("@dddforum/errors/src");
const post_1 = require("../../../domain/post");
const memberUsername_1 = require("../../../../members/domain/memberUsername");
const src_2 = require("@dddforum/outbox/src");
function setupTest(useCase) {
    jest.resetAllMocks();
    let level2Member = member_1.Member.toDomain({
        userId: '8be25ac7-49ff-43be-9f22-3811e268e0bd',
        username: memberUsername_1.MemberUsername.toDomain('jill'),
        reputationScore: 10,
        reputationLevel: member_1.MemberReputationLevel.Level2,
        id: 'bf6b4773-feea-44cd-a951-f0ffd68625ea'
    });
    useCase['memberRepository'].getMemberById = jest.fn().mockResolvedValue(level2Member);
    return level2Member;
}
describe('createPost', () => {
    let prisma = new client_1.PrismaClient();
    let outboxTable = new src_2.EventOutboxTable(prisma);
    let membersRepo = new productionMembersRepository_1.ProductionMembersRepository(prisma, outboxTable);
    let postsRepo = new productionPostsRepository_1.ProductionPostsRepository(prisma, outboxTable);
    const useCase = new createPost_1.CreatePost(postsRepo, membersRepo);
    describe('permissions & identity', () => {
        test('if the member was not found, they should not be able to create the post', () => __awaiter(void 0, void 0, void 0, function* () {
            useCase['memberRepository'].getMemberById = jest.fn().mockResolvedValue(null);
            const saveSpy = jest.spyOn(useCase['memberRepository'], 'save').mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () { }));
            const command = new postsCommands_1.CreatePostCommand({
                title: 'A new post',
                postType: 'text',
                content: 'This is a new post',
                memberId: 'non-existent-id'
            });
            const response = yield useCase.execute(command);
            expect(response.isSuccess()).toBe(false);
            expect(response.getError() instanceof src_1.ApplicationErrors.NotFoundError).toBe(true);
            expect(response.getError().name).toEqual('NotFoundError');
            expect(saveSpy).not.toHaveBeenCalled();
        }));
        test('as a level 1 member, I should not be able to create a new post', () => __awaiter(void 0, void 0, void 0, function* () {
            const level1Member = member_1.Member.create({
                userId: '8be25ac7-49ff-43be-9f22-3811e268e0bd',
                username: 'jill'
            });
            useCase['memberRepository'].getMemberById = jest.fn().mockResolvedValue(level1Member);
            const command = new postsCommands_1.CreatePostCommand({
                title: 'A new post',
                postType: 'text',
                content: 'This is a new post',
                memberId: level1Member.id
            });
            const response = yield useCase.execute(command);
            expect(response.isSuccess()).toBe(false);
            expect(response.getError() instanceof src_1.ApplicationErrors.PermissionError).toBe(true);
        }));
        test('as a level 2 member, I should be able to create a new post', () => __awaiter(void 0, void 0, void 0, function* () {
            const level2Member = setupTest(useCase);
            const saveSpy = jest.spyOn(useCase['postRepository'], 'save').mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () { }));
            const command = new postsCommands_1.CreatePostCommand({
                title: 'A new post',
                postType: 'text',
                content: 'This is a new post',
                memberId: level2Member.id
            });
            const response = yield useCase.execute(command);
            expect(response.isSuccess()).toBe(true);
            expect(response.getValue() instanceof post_1.Post).toBe(true);
            expect(saveSpy).toHaveBeenCalled();
        }));
    });
    describe('text posts', () => {
        test('as a level 2 member, I should be able to create a new text post with valid post details', () => __awaiter(void 0, void 0, void 0, function* () {
            const level2Member = setupTest(useCase);
            const saveSpy = jest.spyOn(useCase['postRepository'], 'save').mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () { }));
            const command = new postsCommands_1.CreatePostCommand({
                title: 'A new post',
                postType: 'text',
                content: 'This is a new post',
                memberId: level2Member.id
            });
            const response = yield useCase.execute(command);
            expect(response.isSuccess()).toBe(true);
            expect(response.getValue() instanceof post_1.Post).toBe(true);
            expect(response.getValue().title).toEqual('A new post');
            expect(saveSpy).toHaveBeenCalled();
        }));
        test.each([
            { title: '', content: '' },
            { title: 'A', content: 'sdsd' },
            { title: 'Title! Looks good. But no content.', content: '' },
            { title: 'Another', content: '2' }
        ])('as a level 2 member, I should not be able to create a text post with invalid title or content: %o', (_a) => __awaiter(void 0, [_a], void 0, function* ({ title, content }) {
            const level2Member = setupTest(useCase);
            const saveSpy = jest.spyOn(useCase['postRepository'], 'save').mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () { }));
            const command = new postsCommands_1.CreatePostCommand({
                title,
                postType: 'text',
                content,
                memberId: level2Member.id
            });
            const response = yield useCase.execute(command);
            expect(response.isSuccess()).toBe(false);
            expect(response.getError() instanceof src_1.ApplicationErrors.ValidationError).toBe(true);
            expect(saveSpy).not.toHaveBeenCalled();
        }));
    });
    describe('link posts', () => {
        test('as a level 2 member, I should be able to create a new link post with valid post details', () => __awaiter(void 0, void 0, void 0, function* () {
            const level2Member = setupTest(useCase);
            const command = new postsCommands_1.CreatePostCommand({
                title: 'A new post',
                postType: 'link',
                link: 'https://www.google.com',
                memberId: level2Member.id
            });
            const response = yield useCase.execute(command);
            expect(response.isSuccess()).toBe(true);
            expect(response.getValue() instanceof post_1.Post).toBe(true);
            expect(response.getValue().title).toEqual('A new post');
            expect(response.getValue().link).toEqual('https://www.google.com');
        }));
        test.each([
            { title: 'A new post', link: '' },
            { title: 'A new post', link: 'invalid-url' },
            { title: 'A new post', link: 'www.google.com' } // Assuming the link should be a full URL with http/https
        ])('as a level 2 member, I should not be able to create a link post with an invalid link: %o', (_a) => __awaiter(void 0, [_a], void 0, function* ({ title, link }) {
            const level2Member = setupTest(useCase);
            const saveSpy = jest.spyOn(useCase['postRepository'], 'save').mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () { }));
            const command = new postsCommands_1.CreatePostCommand({
                title,
                postType: 'link',
                link,
                memberId: level2Member.id
            });
            const response = yield useCase.execute(command);
            expect(response.isSuccess()).toBe(false);
            expect(response.getError() instanceof src_1.ApplicationErrors.ValidationError).toBe(true);
            expect(saveSpy).not.toHaveBeenCalled();
        }));
    });
    describe('default votes', () => {
        test('as a level 2 member, when creating a new post, the post should have 1 upvote by me', () => __awaiter(void 0, void 0, void 0, function* () {
            let postVoteSaveSpy = jest.spyOn(useCase['postRepository'], 'save').mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () { }));
            const level2Member = setupTest(useCase);
            const command = new postsCommands_1.CreatePostCommand({
                title: 'A new post',
                postType: 'link',
                link: 'https://www.google.com',
                memberId: level2Member.id
            });
            const response = yield useCase.execute(command);
            expect(response.isSuccess()).toBe(true);
            const post = response.getValue();
            expect(post.title).toEqual('A new post');
            expect(post.link).toEqual('https://www.google.com');
            expect(postVoteSaveSpy).toHaveBeenCalledTimes(1);
        }));
    });
});
