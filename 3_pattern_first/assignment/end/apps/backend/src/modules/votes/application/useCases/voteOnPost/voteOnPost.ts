
import { ApplicationErrors } from "@dddforum/errors/application";
import { ServerErrors } from "@dddforum/errors/server";
import { Result, success, UseCase } from "@dddforum/core";
import { MembersRepository } from "../../../../members/repos/ports/membersRepository";

import { CanVoteOnPostPolicy } from "./canVoteOnPost";
import { PostsRepository } from "../../../../posts/repos/ports/postsRepository";
import { VoteRepository } from "../../../repos/ports/voteRepository";
import { Commands } from "@dddforum/api/votes";
import { EventBus } from "@dddforum/bus";
import { PostVote } from "../../../domain/postVote";

type VoteOnPostError = 
  | ApplicationErrors.ValidationError 
  | ApplicationErrors.PermissionError 
  | ApplicationErrors.NotFoundError 
  | ServerErrors.DatabaseError;

export class VoteOnPost implements UseCase<Commands.VoteOnPostCommand, Result<PostVote, VoteOnPostError>> {

  constructor(
    private memberRepository: MembersRepository,
    private postRepository: PostsRepository,
    private voteRepository: VoteRepository,
    private eventBus: EventBus
  ) {}

  async execute(request: Commands.VoteOnPostCommand): Promise<Result<PostVote, VoteOnPostError>> {
    let postVote: PostVote;
    const { memberId, postId, voteType } = request.props;

    const [memberOrNull, postOrNull, existingVoteOrNull] = await Promise.all([
      this.memberRepository.getMemberById(memberId),
      this.postRepository.getPostDetailsById(postId),
      this.voteRepository.findVoteByMemberAndPostId(memberId, postId)
    ]);

    if (memberOrNull === null) {
      return fail(new ApplicationErrors.NotFoundError('member'));
    }

    if (postOrNull === null) {
      return fail(new ApplicationErrors.NotFoundError('post'));
    }

    if (!CanVoteOnPostPolicy.isAllowed(memberOrNull)) {
      return fail(new ApplicationErrors.PermissionError()); 
    }

    if (existingVoteOrNull) {
      postVote = existingVoteOrNull
      
    } else {
      let postVoteOrError = PostVote.create(memberId, postId);

      if (postVoteOrError instanceof ApplicationErrors.ValidationError) {
        return fail(postVoteOrError);
      }
      postVote = postVoteOrError;
    }

    postVote.castVote(voteType)

    try {
      const domainEvents = postVote.getDomainEvents();
      
      await this.voteRepository.save(postVote);
      await this.eventBus.publishEvents(domainEvents)

      return success(postVote);
      
    } catch (error) {
      console.log(error);
      return fail(new ServerErrors.DatabaseError());
    }
  }
}
