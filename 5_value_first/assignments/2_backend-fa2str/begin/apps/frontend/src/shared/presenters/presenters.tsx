
import { PostsPresenter } from "../../modules/posts/application/presenters/postsPresenter";
import { RegistrationPresenter } from "@/modules/auth/application/presenters/registrationPresenter";
import { LayoutPresenter } from "../layout/application/presenters/layoutPresenter";
import { OnboardingPresenter } from "@/pages/onboarding/application/presenters/onboardingPresenter";

export class Presenters {
  constructor(
    public registration: RegistrationPresenter,
    public posts: PostsPresenter,
    public layout: LayoutPresenter,
    public onboarding: OnboardingPresenter
  ) {}
} 
