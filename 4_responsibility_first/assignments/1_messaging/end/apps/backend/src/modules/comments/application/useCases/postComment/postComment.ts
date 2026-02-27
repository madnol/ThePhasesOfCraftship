import { Result, UseCase, success, fail } from "@dddforum/core";
import { CommentRepository } from "../../../repos/ports/commentRepository";
import { Comment } from "../../../domain/comment";
import { ApplicationErrors } from "@dddforum/errors/application";
import { Comments } from "@dddforum/api";
import { PostsRepository } from "../../../../posts/repos/ports/postsRepository";
import { CanPostCommentPolicy } from "./canPostComment";
import { MembersRepository } from "../../../../members/repos/ports/membersRepository";

export type PostCommentError = 
  | ApplicationErrors.ValidationError 
  | ApplicationErrors.PermissionError
  | ApplicationErrors.NotFoundError;

export class PostComment implements UseCase<Comments.Commands.PostCommentCommand, Result<Comment, PostCommentError>> {
  constructor(
    private commentRepo: CommentRepository,
    private postRepository: PostsRepository,
    private memberRepository: MembersRepository
  ) {}

  async execute(command: Comments.Commands.PostCommentCommand): Promise<Result<Comment, PostCommentError>> {
    const { postId, text, parentCommentId, memberId } = command.props;

    const memberOrNull = await this.memberRepository.getMemberById(memberId);

    if (!memberOrNull) {
      return fail(new ApplicationErrors.NotFoundError('member'));
    }

    if (!CanPostCommentPolicy.isAllowed(memberOrNull)) {
      return fail(new ApplicationErrors.PermissionError('Not allowed to post comments'))
    }

    // Verify post exists
    const post = await this.postRepository.getPostById(postId);
    
    if (!post) {
      return fail(new ApplicationErrors.NotFoundError('post'));
    }

    // Create comment
    const commentOrError = Comment.create({
      postId,
      text,
      parentCommentId,
      memberId: memberOrNull.id
    });

    if (commentOrError instanceof ApplicationErrors.ValidationError) {
      return fail(commentOrError);
    }

    await this.commentRepo.saveAggregateAndEvents(commentOrError, commentOrError.getDomainEvents());

    return success(commentOrError);
  }
}