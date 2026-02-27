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
const member_1 = require("../../../domain/member");
const createMember_1 = require("./createMember");
const productionMembersRepository_1 = require("../../../repos/adapters/productionMembersRepository");
const userIdentityService_1 = require("../../../../users/application/userIdentityService");
const memberCommands_1 = require("../../../memberCommands");
const src_1 = require("@dddforum/errors/src");
const src_2 = require("@dddforum/outbox/src");
const firebaseAuth_1 = require("../../../../users/externalServices/adapters/firebaseAuth");
describe('createMember', () => {
    let prisma = new client_1.PrismaClient();
    let firebaseAuth = new firebaseAuth_1.FirebaseAuth();
    let usersService = new userIdentityService_1.UserIdentityService(firebaseAuth);
    let outboxTable = new src_2.EventOutboxTable(prisma);
    let membersRepo = new productionMembersRepository_1.ProductionMembersRepository(prisma, outboxTable);
    const useCase = new createMember_1.CreateMember(membersRepo);
    beforeEach(() => {
        jest.resetAllMocks();
    });
    test('should create a member when username is available and data is valid', () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock repository to say username is not taken
        useCase['memberRepository'].getMemberByUserId = jest.fn().mockResolvedValue(null);
        const saveSpy = jest.spyOn(useCase['memberRepository'], 'save').mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () { }));
        const command = new memberCommands_1.CreateMemberCommand({
            username: 'validuser',
            email: 'test@example.com',
            userId: 'auth0|123'
        });
        const response = yield useCase.execute(command);
        expect(response.isSuccess()).toBe(true);
        expect(response.getValue() instanceof member_1.Member).toBe(true);
        expect(saveSpy).toHaveBeenCalled();
    }));
    test('should fail if username is already taken', () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock repository to say username is taken
        const existingMember = member_1.Member.create({
            username: 'takenuser',
            userId: 'existing-user-id'
        });
        useCase['memberRepository'].findUserByUsername = jest.fn().mockResolvedValue(existingMember);
        const saveSpy = jest.spyOn(useCase['memberRepository'], 'save').mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () { }));
        const command = new memberCommands_1.CreateMemberCommand({
            username: 'takenuser',
            email: 'test@example.com',
            userId: 'auth0|123'
        });
        const response = yield useCase.execute(command);
        expect(response.isSuccess()).toBe(false);
        expect(response.getError().name).toBe('MemberUsernameTaken');
        expect(saveSpy).not.toHaveBeenCalled();
    }));
    test('should fail if validation fails', () => __awaiter(void 0, void 0, void 0, function* () {
        useCase['memberRepository'].findUserByUsername = jest.fn().mockResolvedValue(null);
        const saveSpy = jest.spyOn(useCase['memberRepository'], 'save').mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () { }));
        const command = new memberCommands_1.CreateMemberCommand({
            username: '', // Invalid username
            email: 'test@example.com',
            userId: 'auth0|123'
        });
        const response = yield useCase.execute(command);
        expect(response.isSuccess()).toBe(false);
        expect(response.getError() instanceof src_1.ApplicationErrors.ValidationError).toBe(true);
        expect(saveSpy).not.toHaveBeenCalled();
    }));
});
