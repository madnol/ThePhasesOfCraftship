
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
    // implement
    throw new Error("Not yet implemented")
  }
}
