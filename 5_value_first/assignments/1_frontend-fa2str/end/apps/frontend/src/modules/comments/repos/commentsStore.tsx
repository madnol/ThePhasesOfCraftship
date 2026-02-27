import { makeAutoObservable } from "mobx";
import { APIClient } from "@dddforum/api";
import { CommentDm } from "../domain/commentDm";
import { CommentsRepository } from "./commentsRepo";

export class CommentsStore implements CommentsRepository {
  public comments: CommentDm[] = [];

  constructor(private api: APIClient) {
    makeAutoObservable(this);
  }

  async getCommentsByPostId(postId: string): Promise<CommentDm[]> {
    const response = await this.api.comments.getCommentsByPostId(postId);
    if (response.success && response.data) {
      this.comments = response.data.map(dto => CommentDm.fromDTO(dto));
      return this.comments;
    }
    return [];
  }
} 