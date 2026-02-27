
import { PostModel } from "@dddforum/database";
import { MemberReadModel } from "../../members/domain/memberReadModel";
import { Types, DTOs } from "@dddforum/api/posts";

interface PostReadModelProps {
  id: string;
  title: string;
  content: string | undefined;
  link: string | undefined;
  member: MemberReadModel;
  numComments: number;
  voteScore: number;
  postType: Types.PostType;
  dateCreated: string;
  lastUpdated: string;
  slug: string;
}

export class PostReadModel {
  private props: PostReadModelProps;

  constructor(props: PostReadModelProps) {
    this.props = props;
  }

  get id(): string {
    return this.props.id;
  }

  get slug (): string {
    return this.props.slug;
  }

  public static fromPrismaToDomain(
    prismaPost: PostModel & { _count?: { comments: number } }, 
    member: MemberReadModel
  ): PostReadModel {
    return new PostReadModel({
      id: prismaPost.id,
      title: prismaPost.title,
      content: prismaPost.content ? prismaPost.content : undefined,
      link: prismaPost.link ? prismaPost.link : undefined,
      member: member,
      numComments: prismaPost._count?.comments ?? 0,
      voteScore: prismaPost.voteScore,
      postType: prismaPost.postType as Types.PostType,
      dateCreated: prismaPost.dateCreated.toISOString(),
      lastUpdated: prismaPost.lastUpdated.toISOString(),
      slug: prismaPost.slug,
    });
  }

  public toDTO(): DTOs.PostDTO {
    return {
      id: this.props.id,
      title: this.props.title,
      content: this.props.content,
      postType: this.props.postType,
      dateCreated: this.props.dateCreated,
      lastUpdated: this.props.lastUpdated,
      member: this.props.member.toDTO(),
      numComments: this.props.numComments,
      voteScore: this.props.voteScore,
      slug: this.props.slug,
      link: this.props.link
    };
  }
}


