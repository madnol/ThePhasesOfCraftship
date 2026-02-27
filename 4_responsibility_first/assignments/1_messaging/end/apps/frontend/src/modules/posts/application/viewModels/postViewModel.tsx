import { MemberDm } from "@/modules/auth/domain/memberDm";
import { PostDm } from "../../domain/postDm";

export interface PostViewModelProps {
  id: string;
  title: string;
  content?: string;
  link?: string;
  dateCreated: string;
  memberUsername: string;
  voteScore: number;
  numComments: number;
  slug: string;
  currentMember?: MemberDm | null;
}

export class PostViewModel {
  private readonly props: PostViewModelProps;

  constructor(props: PostViewModelProps) {
    this.props = props;
  }

  get id(): string {
    return this.props.id;
  }

  get title(): string {
    return this.props.title;
  }

  get content(): string | undefined {
    return this.props.content;
  }

  get link(): string | undefined {
    return this.props.link;
  }

  get dateCreated(): string {
    return this.props.dateCreated;
  }

  get voteScore(): number {
    return this.props.voteScore;
  }

  get memberUsername(): string {
    return this.props.memberUsername;
  }

  get numComments(): number {
    return this.props.numComments;
  }

  get canCastVote(): boolean {
    if (!this.props.currentMember) return false;
    return this.props.currentMember.reputationLevel === 'Level2' || this.props.currentMember.reputationLevel === 'Level3';
  }

  get slug(): string {
    return this.props.slug;
  }

  public static fromDomain(post: PostDm, currentMember?: MemberDm | null): PostViewModel {
    const postProps = post.props;
    const props: PostViewModelProps = {
      id: postProps.id,
      title: postProps.title,
      content: postProps.content,
      link: postProps.link,
      dateCreated: postProps.dateCreated,
      memberUsername: postProps.memberUsername,
      voteScore: postProps.voteScore || 0,
      numComments: postProps.numComments,
      slug: postProps.slug,
      currentMember
    };
    return new PostViewModel(props);
  }
}
