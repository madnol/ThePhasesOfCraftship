import { Member } from "../../../../members/domain/member";
import { Types } from '@dddforum/api/members'

export class CanVoteOnPostPolicy {
  public static isAllowed(member: Member): boolean {
    // implement
    throw new Error("Not yet implemented")
  }
}
