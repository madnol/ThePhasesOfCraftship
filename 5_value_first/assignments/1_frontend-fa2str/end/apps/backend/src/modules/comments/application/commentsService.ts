import { CommentReadModel } from "../domain/commentReadModel";
import { CommentRepository } from "../repos/ports/commentRepository";

export class CommentsService {
  constructor(private commentRepo: CommentRepository) {}

  async getCommentsByPostId(postId: string): Promise<CommentReadModel[]> {
    return this.commentRepo.getCommentsByPostId(postId);
  }

  async postComment (postId: string, replyToCommentId?: string) {
    // To be implemented
  }
}
