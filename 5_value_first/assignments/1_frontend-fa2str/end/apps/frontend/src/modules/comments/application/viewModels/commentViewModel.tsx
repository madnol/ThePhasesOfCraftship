import { CommentDm } from "../../domain/commentDm";
import { MemberDm } from "@/modules/auth/domain/memberDm";

interface CommentViewModelProps {
  id: string;
  text: string;
  dateCreated: string;
  memberUsername: string;
  postId: string;
  parentCommentId: string | null;
  points: number;
  childComments: CommentViewModel[];
  currentMember?: MemberDm | null;
}

export class CommentViewModel {
  constructor(private props: CommentViewModelProps) {}

  get id(): string {
    return this.props.id;
  }

  get text(): string {
    return this.props.text;
  }

  get dateCreated(): string {
    return this.props.dateCreated;
  }

  get memberUsername(): string {
    return this.props.memberUsername;
  }

  get postId(): string {
    return this.props.postId;
  }

  get parentCommentId(): string | null {
    return this.props.parentCommentId;
  }

  get points(): number {
    return this.props.points;
  }

  get childComments(): CommentViewModel[] {
    return this.props.childComments;
  }

  get canVoteOnComment(): boolean {
    if (!this.props.currentMember) return false;
    return this.props.currentMember.reputationLevel === 'Level2' || this.props.currentMember.reputationLevel === 'Level3';
  }

  static fromDomain(dm: CommentDm, currentMember?: MemberDm | null): CommentViewModel {
    return new CommentViewModel({
      id: dm.commentId,
      text: dm.text,
      dateCreated: dm.createdAt,
      memberUsername: dm.memberUsername,
      postId: dm.postId,
      parentCommentId: dm.parentCommentId,
      points: dm.points,
      childComments: dm.childComments.map(child => CommentViewModel.fromDomain(child, currentMember)),
      currentMember
    });
  }
}