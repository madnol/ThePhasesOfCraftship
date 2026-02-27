
import { Member } from "../../../../members/domain/member";
import { Types } from '@dddforum/api/members'

export class CanPostCommentPolicy {

  public static isAllowed(member: Member): boolean {
    // Implement
    throw new Error("Not yet implemented")
  }
}
