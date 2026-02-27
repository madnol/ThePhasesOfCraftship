import { makeAutoObservable, observe } from "mobx";
import { PostsFilterValue, SearchFilterViewModel } from "../viewModels/searchFilterViewModel";
import { Posts } from "@dddforum/api";
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

    observe(this.postsStore, 'postsDm', async (postDms) => {
      const currentMember = await this.authStore.getCurrentMember();
      this.postVMs = postDms.newValue.map(postDm => PostViewModel.fromDomain(postDm, currentMember));
    });

    observe(this, 'searchFilter', async (filter) => {
      const query = Posts.Queries.GetPostsQuery.create(filter.newValue.value)
      const postDms = await this.postsStore.getPosts(query);
      const currentMember = await this.authStore.getCurrentMember();
      this.postVMs = postDms.map(postDm => PostViewModel.fromDomain(postDm, currentMember));
    })
  }

  async load (callback?: (posts: PostViewModel[], filter: SearchFilterViewModel) => void) {
    const postDms = await this.postsStore.getPosts();
    const currentMember = await this.authStore.getCurrentMember();
    this.postVMs = postDms.map(postDm => PostViewModel.fromDomain(postDm, currentMember));
    callback && callback(this.postVMs, this.searchFilter);
  }

  switchSearchFilter (nextFilter: PostsFilterValue) {
    this.searchFilter = new SearchFilterViewModel(nextFilter);
  }
}
