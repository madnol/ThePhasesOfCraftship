import { Result, UseCase, success, fail } from "@dddforum/core";
import { MembersRepository } from "../../../repos/ports/membersRepository";
import { Member } from "../../../domain/member";
import { ApplicationErrors } from "@dddforum/errors/application";
import { Commands } from "@dddforum/api/members"
import { EventBus } from "@dddforum/bus";

export type CreateMemberError = 
  | ApplicationErrors.ValidationError 
  | ApplicationErrors.NotFoundError
  | ApplicationErrors.ConflictError;

export class CreateMember implements UseCase<Commands.CreateMemberCommand, Result<Member, CreateMemberError>> {
  constructor(
    private memberRepository: MembersRepository,
    private eventBus: EventBus
  ) {}

  async execute(request: Commands.CreateMemberCommand): Promise<Result<Member, CreateMemberError>> {
    // Implement
    throw new Error('Not yet implemented')
  }
}
