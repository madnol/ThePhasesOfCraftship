import { Database } from "@dddforum/database";
import { Comment as CommentPrismaModel } from "@dddforum/database";
import { Comment } from "../../domain/comment";
import { CommentRepository } from "../ports/commentRepository";
import { CommentReadModel } from "../../domain/commentReadModel";
import { MemberReadModel } from "../../../members/domain/memberReadModel";

export class ProductionCommentsRepository implements CommentRepository {
  constructor(private database: Database) {}

  async getCommentById(commentId: string): Promise<Comment | null> {
    const comment = await this.database.getConnection().comment.findUnique({
      where: { id: commentId },
      include: {
        memberPostedBy: true,
        post: true,
        replyComments: {
          include: {
            memberPostedBy: true
          }
        }
      }
    });

    if (!comment) {
      return null;
    }

    return Comment.toDomain(comment);
  }

  async getCommentsByPostId(postId: string): Promise<CommentReadModel[]> {
    const comments = await this.database.getConnection().comment.findMany({
      where: {
        postId: postId,
        parentCommentId: null // Only get top-level comments
      },
      include: {
        memberPostedBy: true,
        post: true,
        replyComments: {
          include: {
            memberPostedBy: true
          }
        }
      },
      orderBy: {
        dateCreated: 'desc'
      }
    });

    return comments.map((comment: CommentPrismaModel & { 
      memberPostedBy: any,
      replyComments?: Array<CommentPrismaModel & { memberPostedBy: any }>
    }) => 
      CommentReadModel.fromPrisma(comment, MemberReadModel.fromPrisma(comment.memberPostedBy))
    );
  }
}
