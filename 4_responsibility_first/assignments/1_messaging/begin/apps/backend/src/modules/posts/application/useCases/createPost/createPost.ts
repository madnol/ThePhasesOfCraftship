import { ServerErrors } from "@dddforum/errors/server";
import { ApplicationErrors } from "@dddforum/errors/application";
import { CanCreatePostPolicy } from "./canCreatePost";
import { Result, UseCase, fail, success } from '@dddforum/core';
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
    const props = request.getProps();
    const { memberId, title, content, postType, link } = props;

    const member = await this.memberRepository.getMemberById(memberId);
    
    if (member === null) {
      return fail(new ApplicationErrors.NotFoundError('member'));
    }

    if (!CanCreatePostPolicy.isAllowed(member)) {
      return fail(new ApplicationErrors.PermissionError());
    }

    const postOrError = Post.create({
      title: title,
      content: content,
      memberId: memberId,
      postType,
      link
    });

    if (postOrError instanceof ApplicationErrors.ValidationError) {
      return fail(postOrError);
    }

    try {
      await this.postRepository.save(postOrError);
      await this.eventBus.publishEvents(postOrError.getDomainEvents());
      return success(postOrError);
    } catch (error) {
      console.log(error);
      return fail(new ServerErrors.DatabaseError());
    }
  }
}
