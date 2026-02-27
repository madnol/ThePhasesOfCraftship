import { DTOs } from "@dddforum/api/comments";
import { Comment as PrismaCommentModel } from "@dddforum/database";
import { MemberReadModel } from "../../members/domain/memberReadModel";

interface CommentReadModelProps {
  id: string;
  text: string;
  createdAt: Date;
  member: MemberReadModel;
  parentCommentId?: string;
  childComments: CommentReadModel[];
  points: number;
  postId: string;
}

export class CommentReadModel {
  private props: CommentReadModelProps;

  constructor(props: CommentReadModelProps) {
    this.props = props;
  }

  public static fromPrisma(commentModel: PrismaCommentModel & { 
    memberPostedBy: any,
    replyComments?: Array<PrismaCommentModel & { 
      memberPostedBy: any 
    }>
  }, member: MemberReadModel): CommentReadModel {
    return new CommentReadModel({
      id: commentModel.id,
      text: commentModel.text,
      createdAt: commentModel.dateCreated,
      member: member,
      parentCommentId: commentModel.parentCommentId || undefined,
      childComments: (commentModel.replyComments || []).map((child) => 
        CommentReadModel.fromPrisma(child, MemberReadModel.fromPrisma(child.memberPostedBy))
      ),
      points: commentModel.voteScore,
      postId: commentModel.postId
    });
  }

  public toDTO(): DTOs.CommentDTO {
    return {
      id: this.props.id,
      commentId: this.props.id,
      text: this.props.text,
      createdAt: this.props.createdAt,
      member: this.props.member.toDTO(),
      parentCommentId: this.props.parentCommentId,
      childComments: this.props.childComments.map(child => child.toDTO()),
      points: this.props.points,
      postId: this.props.postId
    };
  }
} 