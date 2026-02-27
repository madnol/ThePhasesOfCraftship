import { Comment } from "../../domain/comment";
import { CommentReadModel } from "../../domain/commentReadModel";

export interface CommentRepository {
  getCommentById(commentId: string): Promise<Comment | null>;
  getCommentsByPostId(postId: string): Promise<CommentReadModel[]>;
}
