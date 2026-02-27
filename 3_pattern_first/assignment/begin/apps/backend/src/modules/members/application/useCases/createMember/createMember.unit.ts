import { Member } from "../../../domain/member";
import { CreateMember } from "./createMember";
import { ProductionMembersRepository } from "../../../repos/adapters/productionMembersRepository";
import { PrismaDatabase } from "@dddforum/database";
import { Commands, Types } from '@dddforum/api/members'
import { Config } from "@dddforum/config";
import * as Users from '@dddforum/api/users';
import { InMemoryEventBus } from "@dddforum/bus";

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
    // Implement
    throw new Error("Not yet implemented")
  });

  test('should fail if username is already taken', async () => {
    // Implement
    throw new Error("Not yet implemented")
  });

  test('should fail if validation fails', async () => {
    // Implement
    throw new Error("Not yet implemented")
  });
});
