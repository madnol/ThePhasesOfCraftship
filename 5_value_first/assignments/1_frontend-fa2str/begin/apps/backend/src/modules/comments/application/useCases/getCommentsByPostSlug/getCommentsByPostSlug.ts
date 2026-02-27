import { CommentRepository } from "../../../repos/ports/commentRepository";
import { CommentReadModel } from "../../../domain/commentReadModel";

export interface GetCommentsByPostSlugInput {
  postSlug: string;
}

export class GetCommentsByPostSlug {
  constructor(private commentRepo: CommentRepository) {}

  async execute(input: GetCommentsByPostSlugInput): Promise<CommentReadModel[]> {
    return this.commentRepo.getCommentDetailsByPostSlug(input.postSlug);
  }
} 