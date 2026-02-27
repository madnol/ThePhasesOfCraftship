import express from "express";
import { API } from "@dddforum/api/comments";
import { ErrorHandler } from "../../shared/errors";
import { CommentsService } from "./application/commentsService";

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
      const comments = await this.commentsService.getCommentsByPostId(postId);
      
      const response: API.GetCommentsByPostIdAPIResponse = {
        success: true,
        data: comments.map(comment => comment.toDTO())
      };
      
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
} 