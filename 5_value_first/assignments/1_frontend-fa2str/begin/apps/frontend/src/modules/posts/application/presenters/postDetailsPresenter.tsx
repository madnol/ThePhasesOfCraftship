import { makeAutoObservable } from "mobx";
import { PostsRepository } from "../../repos/postsRepository";
import { AuthStore } from "@/modules/auth/authStore";
import { PostViewModel } from "../viewModels/postViewModel";

export class PostDetailsPresenter {

  constructor(
    private postsStore: PostsRepository,
    private authStore: AuthStore
  ) {
    makeAutoObservable(this);
  }

  async loadPost(slug: string) {
    // Implement
  }

  upvotePost () {
    // Not yet implemented - feel free! Remember the membership rules.
  }

  downvotePost () {
    // Not yet implemented - feel free! Remember the membership rules.
  }
}
