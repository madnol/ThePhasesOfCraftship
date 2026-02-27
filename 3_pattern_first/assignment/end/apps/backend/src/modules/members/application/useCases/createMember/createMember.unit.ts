import { Member } from "../../../domain/member";
import { CreateMember } from "./createMember";
import { ProductionMembersRepository } from "../../../repos/adapters/productionMembersRepository";
import { PrismaDatabase } from "@dddforum/database";
import { Commands, Types } from '@dddforum/api/members'
import { Config } from "@dddforum/config";
import * as Users from '@dddforum/api/users';
import { InMemoryEventBus } from "@dddforum/bus";
import { randomUUID } from "crypto";

describe('createMember', () => {
  let config = Config();
  let database = new PrismaDatabase(config);
  let membersRepo = new ProductionMembersRepository(database);
  let eventBus = new InMemoryEventBus();
  const useCase = new CreateMember(membersRepo, eventBus);

  const mockToken: Users.Types.DecodedIdToken = {
    email: 'test@example.com',
    uid: 'auth0|123'
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('should create a member when username is available and data is valid', async () => {
    useCase['memberRepository'].getMemberByUserId = jest.fn().mockResolvedValue(null);
    useCase['memberRepository'].findUserByUsername = jest.fn().mockResolvedValue(null);
    const saveSpy = jest.spyOn(useCase['memberRepository'], 'save')
      .mockImplementation(async () => {});

    const commandOrError = Commands.CreateMemberCommand.fromRequest(mockToken, {
      username: 'validuser'
    });
    expect(commandOrError.isSuccess()).toBe(true);
    if (!commandOrError.isSuccess()) return;

    const result = await useCase.execute(commandOrError.getValue());

    expect(result.isSuccess()).toBe(true);
    expect(result.getValue()).toBeInstanceOf(Member);
    expect(saveSpy).toHaveBeenCalled();
  });

  test('should fail if username is already taken', async () => {
    const existingMember = Member.toDomain({
      id: randomUUID(),
      userId: randomUUID(),
      username: 'takenuser',
      reputationScore: 0,
      reputationLevel: Types.ReputationLevel.Level1,
      dateCreated: new Date(),
      lastUpdated: new Date()
    });

    useCase['memberRepository'].getMemberByUserId = jest.fn().mockResolvedValue(null);
    useCase['memberRepository'].findUserByUsername = jest.fn().mockResolvedValue(existingMember);
    const saveSpy = jest.spyOn(useCase['memberRepository'], 'save')
      .mockImplementation(async () => {});

    const commandOrError = Commands.CreateMemberCommand.fromRequest(mockToken, {
      username: 'takenuser',
    });

    expect(commandOrError.isSuccess()).toBe(true);
    if (!commandOrError.isSuccess()) return;

    const result = await useCase.execute(commandOrError.getValue());

    expect(result.isSuccess()).toBe(false);
    expect(result.getError().type).toBe('MemberUsernameTaken');
    expect(saveSpy).not.toHaveBeenCalled();
  });

  test('should fail if validation fails', async () => {
    const commandOrError = Commands.CreateMemberCommand.fromRequest(mockToken, {
      username: '' // Invalid username
    });

    expect(commandOrError.isSuccess()).toBe(false);
  });
});
