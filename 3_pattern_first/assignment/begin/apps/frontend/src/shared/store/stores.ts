
import { AuthStore } from "@/modules/auth/stores/authStore";
import { PostsStore } from "@/modules/posts/stores/productionPostsStore";
import { NavigationStore } from "@/shared/navigation/navigationStore";
import { makeAutoObservable } from "mobx";

export class Stores {
  constructor(
    public auth: AuthStore, // users, auth, member
    public posts: PostsStore,
    public navigation: NavigationStore
  ) {
    makeAutoObservable(this);
  }
} 