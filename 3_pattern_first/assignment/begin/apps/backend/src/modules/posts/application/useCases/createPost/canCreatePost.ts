
import { Member } from "../../../../members/domain/member";
import { Types } from '@dddforum/api/members'

export class CanCreatePostPolicy {

  public static isAllowed(member: Member): boolean {
    // Implement!
    throw new Error('To be implemented')
  }
}
