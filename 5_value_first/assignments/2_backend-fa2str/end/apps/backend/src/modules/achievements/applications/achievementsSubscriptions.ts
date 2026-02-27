
import { EventBus } from "@dddforum/bus";
import { CommentUpvoted } from "../../votes/domain/commentUpvoted";
import { AchievementService } from "./achievementsService";

export class AchievementsSubscriptions {

  constructor (
    private eventBus: EventBus, 
    private achievementService: AchievementService
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions () {
    this.eventBus.subscribe<CommentUpvoted>(CommentUpvoted.name, this.onCommentUpvotedDetectFirstSuperUpvote.bind(this));
  }

  async onCommentUpvotedDetectFirstSuperUpvote (event: CommentUpvoted) {
    // Not yet implemented
  }
}