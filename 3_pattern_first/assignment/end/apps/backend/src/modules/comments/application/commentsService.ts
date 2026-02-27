
import { CommentRepository } from "../repos/ports/commentRepository";
import { PostComment, PostCommentError } from "./useCases/postComment/postComment";
import { Result } from "@dddforum/core";
import { Comment } from "../domain/comment";
import { Comments } from "@dddforum/api";
import { PostsRepository } from "../../posts/repos/ports/postsRepository";
import { MembersRepository } from "../../members/repos/ports/membersRepository";
import { EventBus } from "@dddforum/bus";

export class CommentsService {
  constructor(
    private commentRepo: CommentRepository,
    private postRepo: PostsRepository,
    private membersRepo: MembersRepository,
    private eventBus: EventBus
  ) {}

  async postComment(
    command: Comments.Commands.PostCommentCommand
  ): Promise<Result<Comment, PostCommentError>> {
    return new PostComment(this.commentRepo, this.postRepo, this.membersRepo, this.eventBus).execute(command);
  }

  async getCommentsByPostId(postId: string): Promise<Result<Comment[], PostCommentError>> {
    const comments = await this.commentRepo.getCommentsByPostId(postId);
    return Result.success(comments);
  }
}
