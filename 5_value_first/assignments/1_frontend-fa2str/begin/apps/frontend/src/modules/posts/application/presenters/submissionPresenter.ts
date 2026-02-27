
import { makeAutoObservable } from "mobx";
import { AuthStore } from "@/modules/auth/authStore";
import { PostsStore } from "@/modules/posts/repos/postsStore";
import { NavigationStore } from "@/shared/navigation/navigationStore";
import { SubmissionViewModel } from "../viewModels/submissionViewModel";

export class SubmissionPresenter {

  constructor(
    private authStore: AuthStore,
    private navigationStore: NavigationStore,
    private postsStore: PostsStore,
  ) {
    makeAutoObservable(this);
    this.setupSubscriptions();
  }

  setupSubscriptions() {

  }

  async load(onData?: (vm: SubmissionViewModel) => void) {

  }

  submit = async (input: { title: string; content: string; link?: string }) => {
    // Implement!
  }
} 