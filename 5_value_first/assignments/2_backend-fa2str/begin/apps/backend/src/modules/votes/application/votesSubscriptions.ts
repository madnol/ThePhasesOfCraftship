

import { CommentUpvoted } from "../domain/commentUpvoted";
import { CommentDownvoted } from "../domain/commentDownvoted";
import { Commands } from '@dddforum/api/votes'
import { VotesService } from "./votesService";
import { PostCreated } from "../../posts/domain/postCreated";
import { PostDownvoted } from "../domain/postDownvoted";
import { EventBus } from "@dddforum/bus";
import { PostUpvoted } from "../domain/postUpvoted";
import { CommentPosted } from "../../comments/domain/commentPosted";

export class VotesSubscriptions {

  constructor (private eventBus: EventBus, private voteService: VotesService) {
    this.setupSubscriptions();
  }

  setupSubscriptions () {
    this.eventBus.subscribe<PostCreated>(PostCreated.name, this.onPostCreatedCastInitialUpvote.bind(this));
    this.eventBus.subscribe<CommentPosted>(CommentPosted.name, this.onCommentPostedCastInitialUpvote.bind(this))

    this.eventBus.subscribe<PostUpvoted>(PostUpvoted.name, this.onPostOrCommentVoteChanged.bind(this));
    this.eventBus.subscribe<PostDownvoted>(PostDownvoted.name, this.onPostOrCommentVoteChanged.bind(this));
    this.eventBus.subscribe<CommentUpvoted>(CommentUpvoted.name, this.onPostOrCommentVoteChanged.bind(this));
    this.eventBus.subscribe<CommentDownvoted>(CommentDownvoted.name, this.onPostOrCommentVoteChanged.bind(this));
  }

  async onPostCreatedCastInitialUpvote (event: PostCreated) {
    try {
      
      console.log('casting initial vote on post')
      const command = new Commands.VoteOnPostCommand({
        postId: event.data.postId,
        voteType: 'upvote',
        memberId: event.data.memberId
      });
      let response = await this.voteService.castVoteOnPost(command);
      // If not successful, handle.
    } catch (error) {
      console.log(error);
      // Handle
    }
  }

  async onCommentPostedCastInitialUpvote (event: CommentPosted) {
    
    try {
      console.log('casting initial vote on comment!')
      const command = new Commands.VoteOnCommentCommand({
        commentId: event.data.commentId,
        voteType: 'upvote',
        memberId: event.data.memberId
      });
      let response = await this.voteService.castVoteOnComment(command);
      // If not successful, handle.
    } catch (error) {
      console.log(error);
      // Handle
    }
  }

  async onPostOrCommentVoteChanged(event: CommentUpvoted | PostUpvoted | CommentDownvoted | CommentUpvoted) {
    try {
      console.log('updating member reputation score based on post vote')
      const command = new Commands.UpdateMemberReputationScoreCommand({
        memberId: event.data.memberId
      });
      let response = await this.voteService.updateMemberReputationScore(command);
      // If not successful, handle.
    } catch (error) {
      console.log(error);
      // Handle
    }
  }
}
