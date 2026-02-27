import { AggregateRoot } from "@dddforum/core";
import { CommentModel } from "@dddforum/database";
import { ApplicationErrors } from "@dddforum/errors/application";
import { randomUUID } from "node:crypto";
import { CommentPosted } from "./commentPosted";

export interface CommentProps {
  id: string;
  postId: string;
  text: string;
  memberId: string;
  parentCommentId?: string;
  createdAt: Date;
  voteScore: number;
}

type InputProps = {
  postId: string;
  text: string;
  memberId: string;
  parentCommentId?: string;
}

export class Comment extends AggregateRoot {
  private constructor(private props: CommentProps) {
    super()
  }

  public static create(props: InputProps): Comment | ApplicationErrors.ValidationError {
    // Note: You can improve the domain layer encapsulation by validating value objects
    // at the command level.
    throw new Error('Not yet implemented')
  }

  get id() {
    return this.props.id;
  }

  get postId() {
    return this.props.postId;
  }

  get text() {
    return this.props.text;
  }

  get parentCommentId() {
    return this.props.parentCommentId;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get voteScore() {
    return this.props.voteScore;
  }

  get memberId () {
    return this.props.memberId
  }

  public static toDomain (commentModel: CommentModel): Comment {
    return new Comment({
      id: commentModel.id,
      postId: commentModel.postId,
      text: commentModel.text,
      memberId: commentModel.memberId,
      parentCommentId: commentModel.parentCommentId || "",
      createdAt: commentModel.dateCreated,
      voteScore: commentModel.voteScore
    });
  }

  toPersistence () {
    return {
      id: this.props.id,
      postId: this.props.postId,
      text: this.props.text,
      memberId: this.props.memberId,
      parentCommentId: this.props.parentCommentId || null,
      voteScore: this.props.voteScore
    }
  }
  

  toDTO(): CommentProps {
    return {
      id: this.props.id,
      postId: this.props.postId,
      text: this.props.text,
      memberId: this.props.memberId,
      parentCommentId: this.props.parentCommentId,
      createdAt: this.props.createdAt,
      voteScore: this.props.voteScore
    };
  }
}
