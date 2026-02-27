import express from "express";
import { ErrorHandler } from "../../shared/errors";
import { CommentsService } from "./application/commentsService";
import { Commands } from "@dddforum/api/comments";

export class CommentsController {
  private router: express.Router;

  constructor(
    private commentsService: CommentsService,
    private errorHandler: ErrorHandler
  ) {
    this.router = express.Router();
    this.setupRoutes();
    this.setupErrorHandler();
  }

  getRouter() {
    return this.router;
  }

  private setupRoutes() {
    this.router.get("/posts/:postId/comments", this.getCommentsByPostId.bind(this));
    this.router.post("/posts/:postId/comments", this.postComment.bind(this));
  }

  private setupErrorHandler() {
    this.router.use(this.errorHandler);
  }

  private async getCommentsByPostId(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const postId = req.params.postId;
      const result = await this.commentsService.getCommentsByPostId(postId);
      
      if (result.isFailure()) {
        return res.status(404).json({
          success: false,
          error: {
            message: "Comments not found",
            code: "COMMENTS_NOT_FOUND"
          }
        });
      }

      return res.json({
        success: true,
        data: result.getValue()
      });
    } catch (error) {
      next(error);
    }
  }

  private async postComment(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const commandOrError = Commands.PostCommentCommand.fromRequest(req.body, req.user);

      if (commandOrError.isFailure()) {
        return res.status(400).json({
          success: false,
          error: {
            message: "Missing required parameters",
            code: "MISSING_PARAMS"
          }
        });
      }

      const result = await this.commentsService.postComment(commandOrError.getValue());

      if (result.isFailure()) {
        const error = result.getError();
        if (error instanceof Error && error.name === 'PostNotFound') {
          return res.status(404).json({
            success: false,
            error: {
              message: "Post not found",
              code: "POST_NOT_FOUND"
            }
          });
        }
        return res.status(400).json({
          success: false,
          error: {
            message: "Invalid comment",
            code: "INVALID_COMMENT"
          }
        });
      }

      const comment = result.getValue();
      const commentDTO = comment.toDTO()

      return res.json({
        success: true,
        data: commentDTO
      });
    } catch (error) {
      next(error);
    }
  }
} 