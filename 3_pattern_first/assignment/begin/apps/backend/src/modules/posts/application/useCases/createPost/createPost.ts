import { ServerErrors } from "@dddforum/errors/server";
import { ApplicationErrors } from "@dddforum/errors/application";
import { CanCreatePostPolicy } from "./canCreatePost";
import { Result, UseCase } from '@dddforum/core';
import { Post } from "../../../domain/post";
import { PostsRepository } from "../../../repos/ports/postsRepository";
import { MembersRepository } from "../../../../members/repos/ports/membersRepository";
import { Commands } from '@dddforum/api/posts'
import { EventBus } from "@dddforum/bus";

type CreatePostError = 
  | ApplicationErrors.ValidationError 
  | ApplicationErrors.PermissionError 
  | ApplicationErrors.NotFoundError 
  | ServerErrors.AnyServerError;

export type CreatePostResponse = Result<Post, CreatePostError>;

export class CreatePost implements UseCase<Commands.CreatePostCommand, CreatePostResponse> {

  constructor(
    private postRepository: PostsRepository, 
    private memberRepository: MembersRepository,
    private eventBus: EventBus
  ) {}

  async execute(request: Commands.CreatePostCommand): Promise<CreatePostResponse> {
    // Implement!
    throw new Error('To be implemented');
  }
}
