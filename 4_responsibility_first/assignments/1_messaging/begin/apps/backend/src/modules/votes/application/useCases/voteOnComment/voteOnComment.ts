
import { ApplicationErrors } from "@dddforum/errors/application";
import { ServerErrors } from "@dddforum/errors/server";
import { Result, success, UseCase, fail } from "@dddforum/core";
import { MembersRepository } from "../../../../members/repos/ports/membersRepository";
import { VoteRepository } from "../../../repos/ports/voteRepository";
import { Commands } from "@dddforum/api/votes";
import { EventBus } from "@dddforum/bus";
import { CommentVote } from "../../../domain/commentVote";
import { CanVoteOnCommentPolicy } from "./canVoteOnComment";
import { CommentRepository } from "../../../../comments/repos/ports/commentRepository";

type VoteOnCommentError = 
  | ApplicationErrors.ValidationError 
  | ApplicationErrors.PermissionError 
  | ApplicationErrors.NotFoundError 
  | ServerErrors.DatabaseError;

export class VoteOnComment implements UseCase<Commands.VoteOnCommentCommand, Result<CommentVote, VoteOnCommentError>> {

  constructor(
    private memberRepository: MembersRepository,
    private commentRepo: CommentRepository,
    private voteRepository: VoteRepository,
    private eventBus: EventBus
  ) {}

  async execute(request: Commands.VoteOnCommentCommand): Promise<Result<CommentVote, VoteOnCommentError>> {
    let commentVote: CommentVote;
    const { memberId, commentId, voteType } = request.props;

    const [memberOrNull, commentOrNull, existingVoteOrNull] = await Promise.all([
      this.memberRepository.getMemberById(memberId),
      this.commentRepo.getCommentById(commentId),
      this.voteRepository.findVoteByMemberAndCommentId(memberId, commentId)
    ]);

    if (memberOrNull === null) {
      return fail(new ApplicationErrors.NotFoundError('member'));
    }

    if (commentOrNull === null) {
      return fail(new ApplicationErrors.NotFoundError('comment'));
    }

    if (!CanVoteOnCommentPolicy.isAllowed(memberOrNull, commentOrNull)) {
      return fail(new ApplicationErrors.PermissionError()); 
    }

    if (existingVoteOrNull) {
      commentVote = existingVoteOrNull
      
    } else {
      let commentVoteOrError = CommentVote.create(memberId, commentId);

      if (commentVoteOrError instanceof ApplicationErrors.ValidationError) {
        return fail(commentVoteOrError);
      }
      commentVote = commentVoteOrError;
    }

    commentVote.castVote(voteType)

    try {
      const domainEvents = commentVote.getDomainEvents();
      
      await this.voteRepository.save(commentVote);
      await this.eventBus.publishEvents(domainEvents)

      return success(commentVote);
      
    } catch (error) {
      console.log(error);
      return fail(new ServerErrors.DatabaseError());
    }
  }
}
