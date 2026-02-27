import { MemberDm } from "../../domain/memberDm";

interface OnboardingStatusVmProps {
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  hasCompletedOnboarding: boolean;
  currentMember: MemberDm | null;
  isAuthenticated: boolean;
}

export class OnboardingStatusVm {
  private props: OnboardingStatusVmProps;

  constructor(props: OnboardingStatusVmProps = {
    isLoading: true,
    isSubmitting: false,
    error: null,
    hasCompletedOnboarding: false,
    currentMember: null,
    isAuthenticated: false
  }) {
    this.props = props;
  }

  get isLoading(): boolean {
    return this.props.isLoading;
  }

  set isLoading(value: boolean) {
    this.props.isLoading = value;
  }

  get isSubmitting(): boolean {
    return this.props.isSubmitting;
  }

  set isSubmitting(value: boolean) {
    this.props.isSubmitting = value;
  }

  get error(): string | null {
    return this.props.error;
  }

  set error(value: string | null) {
    this.props.error = value;
  }

  get hasCompletedOnboarding(): boolean {
    return this.props.hasCompletedOnboarding;
  }

  get currentMember(): MemberDm | null {
    return this.props.currentMember;
  }

  get isAuthenticated(): boolean {
    return this.props.isAuthenticated;
  }

  public static fromDomain(member: MemberDm | null, isAuthenticated: boolean): OnboardingStatusVm {
    return new OnboardingStatusVm({
      isLoading: false,
      isSubmitting: false,
      error: null,
      hasCompletedOnboarding: !!member,
      currentMember: member,
      isAuthenticated
    });
  }
}