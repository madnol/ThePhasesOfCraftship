import { Comment } from "../../../../comments/domain/comment";
import { Member } from "../../../../members/domain/member";
import { Types } from '@dddforum/api/members'

export class CanVoteOnCommentPolicy {
  public static isAllowed(member: Member, comment: Comment): boolean {
    // implement
    throw new Error("Not yet implemented")
  }
}
