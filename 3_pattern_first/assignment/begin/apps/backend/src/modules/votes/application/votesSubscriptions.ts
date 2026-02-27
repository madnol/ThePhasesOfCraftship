

import { CommentUpvoted } from "../domain/commentUpvoted";
import { CommentDownvoted } from "../domain/commentDownvoted";
import { Commands } from '@dddforum/api/votes'
import { VotesService } from "./votesService";
import { PostDownvoted } from "../domain/postDownvoted";
import { EventBus } from "@dddforum/bus";
import { PostUpvoted } from "../domain/postUpvoted";

export class VotesSubscriptions {

  constructor (private eventBus: EventBus, private voteService: VotesService) {
    this.setupSubscriptions();
  }

  setupSubscriptions () {
    this.eventBus.subscribe<PostUpvoted>(PostUpvoted.name, this.onPostOrCommentVoteChanged.bind(this));
    this.eventBus.subscribe<PostDownvoted>(PostDownvoted.name, this.onPostOrCommentVoteChanged.bind(this));
    this.eventBus.subscribe<CommentUpvoted>(CommentUpvoted.name, this.onPostOrCommentVoteChanged.bind(this));
    this.eventBus.subscribe<CommentDownvoted>(CommentDownvoted.name, this.onPostOrCommentVoteChanged.bind(this));
  }

  async onPostOrCommentVoteChanged(event: CommentUpvoted | PostUpvoted | CommentDownvoted | CommentUpvoted) {
    try {
      console.log('updating member reputation score based on post vote')
      const command = new Commands.UpdateMemberReputationScoreCommand({
        memberId: event.memberId
      });
      let response = await this.voteService.updateMemberReputationScore(command);
      // If not successful, handle.
    } catch (error) {
      console.log(error);
      // Handle
    }
  }
}
