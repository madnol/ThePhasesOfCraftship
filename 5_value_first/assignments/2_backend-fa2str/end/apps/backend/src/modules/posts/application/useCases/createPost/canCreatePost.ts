
import { Member } from "../../../../members/domain/member";
import { Types } from '@dddforum/api/members'

export class CanCreatePostPolicy {

  public static isAllowed(member: Member): boolean {

    if (member.reputationLevel === Types.ReputationLevel.Level2 || 
        member.reputationLevel === Types.ReputationLevel.Level3) {
      return true;
    }

    return false;
  }
}
