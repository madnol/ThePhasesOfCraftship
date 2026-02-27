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
    const { username, userId } = request.props;
    let existingMember: Member | null = null;

    existingMember = await this.memberRepository.getMemberByUserId(userId);

    if (existingMember) {
      return success(existingMember);
    }

    existingMember = await this.memberRepository.findUserByUsername(username);
    if (existingMember) {
      return fail(new ApplicationErrors.ConflictError('member'));
    }

    const memberOrError = Member.create({
      username,
      userId,
    });

    if (memberOrError.isFailure()) {
      return fail(memberOrError.getError());
    }

    const member = memberOrError.getValue();

    await this.memberRepository.save(member);
    await this.eventBus.publishEvents(member.getDomainEvents())

    return success(member);
  }
}
