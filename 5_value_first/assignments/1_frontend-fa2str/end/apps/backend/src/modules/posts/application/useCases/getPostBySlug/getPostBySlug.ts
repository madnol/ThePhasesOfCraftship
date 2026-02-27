import { Result, UseCase } from "@dddforum/core";
import { PostsRepository } from "../../../repos/ports/postsRepository";
import { PostReadModel } from "../../../domain/postReadModel";
import { ApplicationErrors } from "@dddforum/errors/application";

export class GetPostBySlug implements UseCase<string, Result<PostReadModel, ApplicationErrors.NotFoundError>> {
  constructor(private postsRepo: PostsRepository) {}

  async execute(slug: string): Promise<Result<PostReadModel, ApplicationErrors.NotFoundError>> {
    const post = await this.postsRepo.getPostBySlug(slug);
    
    if (!post) {
      return Result.failure(new ApplicationErrors.NotFoundError('post'));
    }

    return Result.success(post);
  }
} 