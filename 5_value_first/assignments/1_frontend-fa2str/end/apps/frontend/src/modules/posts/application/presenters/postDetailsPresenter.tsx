import { makeAutoObservable } from "mobx";
import { PostsRepository } from "../../repos/postsRepository";
import { AuthStore } from "@/modules/auth/authStore";
import { PostViewModel } from "../viewModels/postViewModel";

export class PostDetailsPresenter {
  // Improvement - using object calisthentics rules, this should become a single 
  // encapsulated object
  isLoading: boolean = false;
  post: PostViewModel | null = null;
  error: string | null = null;

  constructor(
    private postsStore: PostsRepository,
    private authStore: AuthStore
  ) {
    makeAutoObservable(this);
  }

  async loadPost(slug: string) {
    try {
      this.isLoading = true;
      this.error = null;
      
      const postDm = await this.postsStore.getPostBySlug(slug);
      const currentMember = this.authStore.currentMember;
      
      if (postDm) {
        this.post = PostViewModel.fromDomain(postDm, currentMember);
      } else {
        this.error = "Post not found";
      }
    } catch (err) {
      this.error = "Failed to load post";
      console.error(err);
    } finally {
      this.isLoading = false;
    }
  }

  upvotePost () {
    // Not yet implemented - feel free! Remember the membership rules.
  }

  downvotePost () {
    // Not yet implemented - feel free! Remember the membership rules.
  }
}
