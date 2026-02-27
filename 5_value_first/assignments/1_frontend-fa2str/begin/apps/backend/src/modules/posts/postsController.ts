import express from "express";
import { Queries, API, Commands } from "@dddforum/api/posts";
import { ErrorHandler } from "../../shared/errors";
import { Post } from "./domain/post";
import { PostsService } from "./application/postsService";
import { GetPostBySlug } from "./application/useCases/getPostBySlug/getPostBySlug";
import { CommentsService } from "../comments/application/commentsService";
import { API as CommentsAPI } from "@dddforum/api/comments";

export class PostsController {
  private router: express.Router;

  constructor(
    private postsService: PostsService,
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
    this.router.get("/", this.getPosts.bind(this));
    this.router.post("/new", this.createPost.bind(this));
    this.router.get('/slug/:slug', this.getPostBySlug.bind(this));
    this.router.get('/:postId', this.getPostById.bind(this));
    this.router.get('/:postId/comments', this.getCommentsByPostId.bind(this));
  }

  private setupErrorHandler() {
    this.router.use(this.errorHandler);
  }

  private async getPosts(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    try {
      const query = Queries.GetPostsQuery.fromRequest(req.query);
      console.log(query.sort);
      const posts = await this.postsService.getPosts(query);
      
      const response: API.GetPostsAPIResponse = {
        success: true,
        data: posts.map((p) => p.toDTO()),
      };

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  private async createPost(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    try {
      const commandOrError = Commands.CreatePostCommand.fromRequest(req.body);
      if (!commandOrError.isSuccess()) {
        return next(commandOrError.getError());
      }

      const result = await this.postsService.createPost(commandOrError.getValue());
      if (!result.isSuccess()) {
        return next(result.getError());
      }

      const newPost = result.getValue();
      const postDetails = await this.postsService.getPostDetailsById(newPost.id);

      const response: API.CreatePostAPIResponse = {
        success: true,
        data: postDetails?.toDTO()
      };

      return res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  private async getPostById (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    try {
      const query = Queries.GetPostByIdQuery.fromRequest(req);
      const postOrNothing = await this.postsService.getPostDetailsById(query.postId);

      if (postOrNothing === null) {
        // Improvement: Handle these consistently and with strict types
        return res.status(404).json({
          success: false,
          data: undefined,
          error: {
            code: "PostNotFound",
            message: "Post not found."
          }
        });
      } else {
        const response: API.GetPostByIdAPIResponse = {
          success: true,
          data: postOrNothing.toDTO()
        };
        // Improvement: Handle these consistently and with strict types
        return res.status(200).json(response);
      }
    } catch (error) {
      next(error);
    }
  }

  private async getPostBySlug(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    try {
      const result = await this.postsService.getPostBySlug(req.params.slug);

      if (result.isFailure()) {
        return next(result.getError());
      }

      const response: API.GetPostDetailsResponse = {
        success: true,
        data: result.getValue().toDTO(),
        error: undefined
      };

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  private async getCommentsByPostId(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const postId = req.params.postId;
      const comments = await this.commentsService.getCommentsByPostId(postId);
      
      const response: CommentsAPI.GetCommentsByPostIdAPIResponse = {
        success: true,
        data: comments.map(comment => comment.toDTO())
      };
      
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
