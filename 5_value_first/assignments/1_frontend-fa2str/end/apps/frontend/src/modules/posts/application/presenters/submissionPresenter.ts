import { makeAutoObservable, observe } from "mobx";
import { ApplicationErrors } from "@dddforum/errors/application";
import { Posts } from "@dddforum/api";
import { AuthStore } from "@/modules/auth/authStore";
import { PostsStore } from "@/modules/posts/repos/postsStore";
import { NavigationStore } from "@/shared/navigation/navigationStore";
import { SubmissionViewModel } from "../viewModels/submissionViewModel";

export class SubmissionPresenter {
  private vm: SubmissionViewModel = new SubmissionViewModel();

  constructor(
    private authStore: AuthStore,
    private navigationStore: NavigationStore,
    private postsStore: PostsStore,
  ) {
    makeAutoObservable(this);
    this.setupSubscriptions();
  }

  setupSubscriptions() {
    observe(this.authStore, 'currentUser', async () => {
      const member = await this.authStore.getCurrentMember();
      this.vm = SubmissionViewModel.fromDomain(member);
    });
  }

  async load(onData?: (vm: SubmissionViewModel) => void) {
    const member = await this.authStore.getCurrentMember();
    this.vm = SubmissionViewModel.fromDomain(member);
    this.vm.isLoading = false;
    onData?.(this.vm);
  }

  submit = async (input: { title: string; content: string; link?: string }) => {
    if (!this.vm.canPost) {
      return;
    }

    try {
      const member = await this.authStore.getCurrentMember();
      
      if (!member) {
        this.vm.error = 'Not authenticated';
        return;
      }

      const commandInput: Posts.Inputs.CreatePostInput = {
        title: input.title,
        content: input.content,
        postType: input.link ? 'link' : 'text',
        memberId: member.id,
        link: input.link
      };

      const commandOrError = Posts.Commands.CreatePostCommand.create(commandInput);

      if (commandOrError instanceof ApplicationErrors.ValidationError) {
        this.vm.error = commandOrError.message;
        return;
      }

      this.vm.isSubmitting = true;
      this.vm.error = null;

      await this.postsStore.create(commandInput);
      this.navigationStore.navigate('/');
    } catch (error) {
      this.vm.error = 'Failed to submit post';
    } finally {
      this.vm.isSubmitting = false;
    }
  }
} 