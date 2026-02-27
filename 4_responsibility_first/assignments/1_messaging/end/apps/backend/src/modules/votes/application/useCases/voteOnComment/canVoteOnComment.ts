import { Comment } from "../../../../comments/domain/comment";
import { Member } from "../../../../members/domain/member";
import { Types } from '@dddforum/api/members'

export class CanVoteOnCommentPolicy {
  public static isAllowed(member: Member, comment: Comment): boolean {
    if (member.reputationLevel === Types.ReputationLevel.Level1) {
      const commentOwnedByMember = comment.memberId === member.id;

      if (!commentOwnedByMember) {
        return false
      } 
    }

    return true;
  }
}
