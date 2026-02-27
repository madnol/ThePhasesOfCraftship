import { Result, UseCase, success, fail } from "@dddforum/core";
import { CommentRepository } from "../../../repos/ports/commentRepository";
import { Comment } from "../../../domain/comment";
import { ApplicationErrors } from "@dddforum/errors/application";
import { Comments } from "@dddforum/api";
import { PostsRepository } from "../../../../posts/repos/ports/postsRepository";
import { CanPostCommentPolicy } from "./canPostComment";
import { EventBus } from "@dddforum/bus";
import { MembersRepository } from "../../../../members/repos/ports/membersRepository";

export type PostCommentError = 
  | ApplicationErrors.ValidationError 
  | ApplicationErrors.PermissionError
  | ApplicationErrors.NotFoundError;

export class PostComment implements UseCase<Comments.Commands.PostCommentCommand, Result<Comment, PostCommentError>> {
  constructor(
    private commentRepo: CommentRepository,
    private postRepository: PostsRepository,
    private memberRepository: MembersRepository,
    private eventBus: EventBus
  ) {}

  async execute(command: Comments.Commands.PostCommentCommand): Promise<Result<Comment, PostCommentError>> {
    // Implement
    throw new Error('Not yet implemented')
  }
}