import { makeAutoObservable } from "mobx";
import { PostsFilterValue, SearchFilterViewModel } from "../viewModels/searchFilterViewModel";
import { AuthStore } from "@/modules/auth/stores/authStore";
import { PostViewModel } from "../viewModels/postViewModel";
import { IPostsStore } from "../../stores/postsStore";

export class PostsPresenter {
  postVMs: PostViewModel[];
  searchFilter: SearchFilterViewModel;

  constructor (private postsStore: IPostsStore, private authStore: AuthStore) {
    makeAutoObservable(this);
    this.postVMs = [];
    this.searchFilter = new SearchFilterViewModel('popular');
    this.setupSubscriptions();
  }

  setupSubscriptions () {
    // Implement
  }

  async load (callback?: (posts: PostViewModel[], filter: SearchFilterViewModel) => void) {
    // Implement
  }

  switchSearchFilter (nextFilter: PostsFilterValue) {
    // Implement
  }
}
