import { AggregateRoot } from "@dddforum/core";
import { randomUUID } from "crypto";
import { CommentUpvoted } from "./commentUpvoted";
import { CommentDownvoted } from "./commentDownvoted";
import { DTOs, Types } from "@dddforum/api/votes";
import { ApplicationErrors } from "@dddforum/errors/application";
import { Member } from "../../members/domain/member";

type VoteState = 'Upvoted' | 'Downvoted' | 'Default';

interface CommentVoteProps {
  id: string;
  memberId: string;
  commentId: string;
  voteState: VoteState;
  voteWeight?: number;
}

export class CommentVote extends AggregateRoot {
  private props: CommentVoteProps;

  private constructor(props: CommentVoteProps) {
    super();
    this.props = props;
  }

  get id(): string {
    return this.props.id;
  }

  get memberId(): string {
    return this.props.memberId;
  }

  get commentId(): string {
    return this.props.commentId;
  }

  get voteState(): VoteState {
    return this.props.voteState;
  }

  getValue (): number {
    switch (this.props.voteState) {
      case 'Upvoted':
        return this.props.voteWeight ? this.props.voteWeight : 1;
      case 'Downvoted':
        return -1;
      default:
        return 0;
    }
  }

  castVote(voteType: Types.VoteType, member: Member) {
    if (voteType === 'upvote') {

      const upvoteWeight = member.getVoteWeight();
      this.upvote(upvoteWeight);
    } else {
      this.downvote();
    }
  }

  private upvote(upvoteWeight: number) {
    if (this.props.voteState === 'Upvoted') {
      return;
    }
    this.props.voteState = 'Upvoted';
    this.props.voteWeight = upvoteWeight;
    const commentUpvote = CommentUpvoted.create({ commentId: this.commentId, memberId: this.memberId });
    this.domainEvents.push(commentUpvote);
  }

  private downvote() {
    if (this.props.voteState === 'Downvoted') {
      return;
    }
    this.props.voteState = 'Downvoted';
    const commentDownvote = CommentDownvoted.create({ commentId: this.commentId, memberId: this.memberId });
    this.domainEvents.push(commentDownvote);
  }

  public static toDomain(props: CommentVoteProps): CommentVote {
    return new CommentVote(props);
  }

  public static create (memberId: string, commentId: string) : CommentVote | ApplicationErrors.ValidationError {

    return new CommentVote({
      id: randomUUID(),
      memberId: memberId,
      commentId: commentId,
      voteState: 'Default'
    });
  }

  toDTO(): DTOs.CommentVoteDTO {
    return {
      memberId: this.memberId,
      commentId: this.commentId,
      voteType: this.voteState.toLowerCase() as Types.VoteType,
      value: this.getValue(),
      isSuperVote: this.voteState === 'Upvoted' && this.getValue() > 1
    };
  }
}
