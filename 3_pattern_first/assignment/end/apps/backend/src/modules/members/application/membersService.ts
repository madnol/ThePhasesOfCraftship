import { MembersRepository } from "../repos/ports/membersRepository";
import { CreateMember, CreateMemberError } from "./useCases/createMember/createMember";
import { GetMemberDetails, GetMemberDetailsError } from "./useCases/getMemberDetails/getMemberDetails";
import { Commands } from '@dddforum/api/members';
import { Result } from "@dddforum/core";
import { Member } from "../domain/member";
import { EventBus } from "@dddforum/bus";

export class MemberService {
  constructor(private membersRepository: MembersRepository, private eventBus: EventBus) {}

  public createMember(command: Commands.CreateMemberCommand): Promise<Result<Member, CreateMemberError>> {
    return new CreateMember(this.membersRepository, this.eventBus).execute(command);
  }

  public getMemberDetails(userId: string): Promise<Result<Member, GetMemberDetailsError>> {
    return new GetMemberDetails(this.membersRepository).execute(userId);
  }
}