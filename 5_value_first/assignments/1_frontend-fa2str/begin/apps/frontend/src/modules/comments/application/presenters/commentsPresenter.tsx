import { makeAutoObservable } from "mobx";
import { CommentViewModel } from "../viewModels/commentViewModel";
import { CommentsStore } from "../../repos/commentsStore";
import { AuthStore } from "@/modules/auth/authStore";
import { CommentsRepository } from "../../repos/commentsRepo";

export class CommentsPresenter {
  public comments: CommentViewModel[] = [];
  public isLoading: boolean = false;
  public error: string | null = null;

  constructor(
    private commentsStore: CommentsRepository,
    private authStore: AuthStore
  ) {
    makeAutoObservable(this);
  }
  
  async loadComments(postId: string) {
    try {
      this.isLoading = true;
      this.error = null;
      const domainComments = await this.commentsStore.getCommentsByPostId(postId);
      this.comments = domainComments.map(comment => 
        CommentViewModel.fromDomain(comment, this.authStore.currentMember)
      );
    } catch (err) {
      this.error = "Failed to load comments";
      console.error(err);
    } finally {
      this.isLoading = false;
    }
  }

  publishCommentOnPost() {
    // Not yet implemented - feel free!
  }

  replyToComment() {
    // Not yet implemented - feel free!
  }

  upvoteComment() {
    // Not yet implemented - feel free!
  }

  downvoteComment() {
    // Not yet implemented - feel free!
  }
}