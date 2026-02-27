
import { AuthStore } from "@/modules/auth/stores/authStore";
import { MembersStore } from "@/modules/auth/stores/membersStore";
import { PostsStore } from "@/modules/posts/stores/productionPostsStore";
import { NavigationStore } from "@/shared/navigation/navigationStore";
import { makeAutoObservable } from "mobx";

export class Stores {
  constructor(
    public auth: AuthStore, // users, auth
    public posts: PostsStore,
    public navigation: NavigationStore,
    public membersStore: MembersStore
  ) {
    makeAutoObservable(this);
  }
} 