import { MemberDm } from "@/modules/auth/domain/memberDm";

export class SubmissionViewModel {
  constructor(
    public isLoading: boolean = true,
    public isSubmitting: boolean = false,
    public error: string | null = null,
    public canPost: boolean = false,
    public disabledMessage: string | undefined = undefined
  ) {}

  public static fromDomain(member: MemberDm | null): SubmissionViewModel {
    const canPost = member?.reputationLevel === 'Level2' || member?.reputationLevel === 'Level3';
    return new SubmissionViewModel(
      false, // isLoading
      false, // isSubmitting
      null,  // error
      canPost,
      canPost ? undefined : "Cannot post until level 2! Go leave comments and engage with posts."
    );
  }
} 