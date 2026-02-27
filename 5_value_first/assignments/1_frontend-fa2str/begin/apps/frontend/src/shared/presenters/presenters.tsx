
import { OnboardingPresenter } from "@/modules/auth/application/presenters/onboardingPresenter";
import { PostsPresenter } from "../../modules/posts/application/presenters/postsPresenter";
import { LayoutPresenter } from "../layout/layoutPresenter";
import { RegistrationPresenter } from "@/modules/auth/registrationPresenter";
import { PostDetailsPresenter } from "@/modules/posts/application/presenters/postDetailsPresenter";
import { SubmissionPresenter } from "@/modules/posts/application/presenters/submissionPresenter";
import { CommentsPresenter } from "@/modules/comments/application/presenters/commentsPresenter";

export class Presenters {
  constructor(
    public onboarding: OnboardingPresenter,
    public registration: RegistrationPresenter,
    public posts: PostsPresenter,
    public submission: SubmissionPresenter,
    public layout: LayoutPresenter,
    public postDetails: PostDetailsPresenter,
    public comments: CommentsPresenter
  ) {}
} 
