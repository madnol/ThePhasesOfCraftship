import { Comments } from "@dddforum/api";

interface CommentDmProps {
  commentId: string;
  text: string;
  postId: string;
  parentCommentId: string | null;
  memberUsername: string;
  createdAt: string;
  points: number;
  childComments: CommentDm[];
}

export class CommentDm {
  constructor(private props: CommentDmProps) {}

  get commentId(): string {
    return this.props.commentId;
  }

  get text(): string {
    return this.props.text;
  }

  get postId(): string {
    return this.props.postId;
  }

  get parentCommentId(): string | null {
    return this.props.parentCommentId;
  }

  get memberUsername(): string {
    return this.props.memberUsername;
  }

  get createdAt(): string {
    return this.props.createdAt;
  }

  get points(): number {
    return this.props.points;
  }

  get childComments(): CommentDm[] {
    return this.props.childComments;
  }

  static fromDTO(dto: Comments.DTOs.CommentDTO): CommentDm {
    return new CommentDm({
      commentId: dto.commentId,
      text: dto.text,
      postId: dto.postId,
      parentCommentId: dto.parentCommentId || null,
      memberUsername: dto.member.username,
      createdAt: dto.createdAt.toString(),
      points: dto.points,
      childComments: (dto.childComments || []).map(child => CommentDm.fromDTO(child))
    });
  }
} 