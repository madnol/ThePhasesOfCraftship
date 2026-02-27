
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { PostCreated } from "./postCreated";
import { AggregateRoot } from "@dddforum/core";
import { Inputs, Types } from "@dddforum/api/posts";
import { ApplicationErrors } from "@dddforum/errors/application";
import { PostModel } from '@dddforum/database'
import { PostSlug } from "./postSlug";


interface PostProps {
  id: string;
  memberId: string;
  title: string;
  link?: string;
  content?: string;
  postType: Types.PostType;
  voteScore: number;
  slug: PostSlug
}

const createTextPostSchema = z.object({
  title: z.string().min(5).max(100),
  content: z.string().min(5).max(3000).optional(),
});

const createLinkPostSchema = z.object({
  title: z.string().min(5).max(100),
  link: z.string().url(),
});

export class Post extends AggregateRoot {
  constructor (
    private props: PostProps
  ) {
    super();
  }

  get id () {
    return this.props.id
  }

  get title () {
    return this.props.title;
  }

  get link () {
    return this.props.link;
  }

  get memberId() {
    return this.props.memberId;
  }

  get content() {
    return this.props.content;
  }

  get postType() {
    return this.props.postType;
  }

  get voteScore () {
    return this.props.voteScore
  }

  get slug () {
    return this.props.slug.value;
  }

  public static create (input: Inputs.CreatePostInput): Post | ApplicationErrors.ValidationError {
    const isTextPost = input.postType === 'text';

    if (isTextPost) {
      
      const validationResult = createTextPostSchema.safeParse(input);

      if (!validationResult.success) {
        return new ApplicationErrors.ValidationError(validationResult.error.errors.map(e => e.message).join(", "));
      }
    } else {
      const linkPostValidationResult = createLinkPostSchema.safeParse(input);

      if (!linkPostValidationResult.success) {
        return new ApplicationErrors.ValidationError(linkPostValidationResult.error.errors.map(e => e.message).join(", "));
      }
    }

    const postId = randomUUID();

    const post = new Post({
      ...input,
      voteScore: 0,
      id: postId,
      slug: PostSlug.create(input.title)
    });

    post.domainEvents.push(PostCreated.create({ postId: postId, memberId: input.memberId}));

    return post;
  }

  public static toDomain (prismaModel: PostModel): Post {
    return new Post({
      id: prismaModel.id,
      memberId: prismaModel.memberId,
      title: prismaModel.title,
      content: prismaModel.content ? prismaModel.content : undefined,
      link: prismaModel.link ? prismaModel.link : undefined,
      postType: prismaModel.postType as Types.PostType,
      voteScore: prismaModel.voteScore,
      slug: PostSlug.toDomain(prismaModel.slug)
    });
  }
}
