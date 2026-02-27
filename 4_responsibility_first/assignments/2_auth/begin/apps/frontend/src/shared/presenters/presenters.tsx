
import { PostsPresenter } from "../../modules/posts/application/presenters/postsPresenter";
import { RegistrationPresenter } from "@/modules/auth/application/presenters/registrationPresenter";
import { LayoutPresenter } from "../layout/application/presenters/layoutPresenter";

export class Presenters {
  constructor(
    public registration: RegistrationPresenter,
    public posts: PostsPresenter,
    public layout: LayoutPresenter,
  ) {}
} 
