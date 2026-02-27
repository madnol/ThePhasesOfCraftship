
import { Member } from "../../../../members/domain/member";
import { Types } from '@dddforum/api/members'

export class CanPostCommentPolicy {

  public static isAllowed(member: Member): boolean {

    if (member.reputationLevel === Types.ReputationLevel.Level1 
      || member.reputationLevel === Types.ReputationLevel.Level2
      || member.reputationLevel === Types.ReputationLevel.Level3
    ) {
      return true;
    }

    // In reality, any level can post comments. Authorization rule here.
    // Authentication is handled elsewhere.

    return false;
  }
}
