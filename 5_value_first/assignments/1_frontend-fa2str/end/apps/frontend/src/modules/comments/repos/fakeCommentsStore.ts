import { Comments } from "@dddforum/api";
import { CommentDm } from "../domain/commentDm";
import { CommentsRepository } from "./commentsRepo";

export class FakeCommentsStore implements CommentsRepository {
  comments: CommentDm[] = [];

  constructor(fakeCommentsData: Comments.DTOs.CommentDTO[]) {
    this.comments = fakeCommentsData.map(commentDTO => CommentDm.fromDTO(commentDTO));
  }

  async getCommentsByPostId(postId: string): Promise<CommentDm[]> {
    return this.comments;
  }
} 