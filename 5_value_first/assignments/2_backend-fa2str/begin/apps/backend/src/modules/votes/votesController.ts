import express from "express";
import { API } from "@dddforum/api/votes";
import { ErrorHandler } from "../../shared/errors";
import { VotesService } from "./application/votesService";
import { Commands } from "@dddforum/api/votes";

export class VotesController {
  private router: express.Router;

  constructor(
    private votesService: VotesService,
    private errorHandler: ErrorHandler,
  ) {
    this.router = express.Router();
    this.setupRoutes();
    this.setupErrorHandler();
  }

  getRouter() {
    return this.router;
  }

  private setupRoutes() {
    this.router.post("/post/:postId/new", this.castVoteOnPost.bind(this));
    this.router.post("/comment/:commentId/new", this.castVoteOnComment.bind(this));
  }

  private setupErrorHandler() {
    this.router.use(this.errorHandler);
  }

  private async castVoteOnComment (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    try {
      const command = new Commands.VoteOnCommentCommand({
        commentId: req.params.commentId,
        voteType: req.body.voteType,
        memberId: req.body.memberId
      });

      const result = await this.votesService.castVoteOnComment(command);

      if (!result.isSuccess()) {
        return next(result.getError());
      }

      const commentVote = result.getValue();
      const response: API.VoteOnCommentAPIResponse = {
        success: true,
        data: commentVote.toDTO()
      };
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  private async castVoteOnPost(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    try {
      const command = new Commands.VoteOnPostCommand({
        postId: req.params.postId,
        voteType: req.body.voteType,
        memberId: req.body.memberId
      });

      const result = await this.votesService.castVoteOnPost(command);

      if (!result.isSuccess()) {
        return next(result.getError());
      }

      const postVote = result.getValue();
      const response: API.VoteOnPostAPIResponse = {
        success: true,
        data: postVote.toDTO()
      };
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
