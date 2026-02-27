
import { ApplicationModule } from "../../shared/modules/applicationModule";
import { Database } from "@dddforum/database";
import { CommentRepository } from "./repos/ports/commentRepository";
import { ProductionCommentsRepository } from "./repos/adapters/productionCommentRepository";
import { CommentsService } from "./application/commentsService";
import { Config } from "@dddforum/config";
import { WebServer } from "../../shared/http/webServer";
import { CommentsController } from "./commentsController";
import { commentsErrorHandler } from "./commentsErrors";

export class CommentsModule extends ApplicationModule {
  private commentsRepository: CommentRepository;
  private commentsService: CommentsService;
  private commentsController: CommentsController;

  private constructor(
    private db: Database,
    config: Config,
  ) {
    super(config);
    this.commentsRepository = this.createCommentRepository();
    this.commentsService = this.createCommentsService();
    this.commentsController = this.createCommentsController();
  }

  static build(db: Database, config: Config) {
    return new CommentsModule(db, config);
  }

  private createCommentRepository() {
    if (this.commentsRepository) return this.commentsRepository;
    return new ProductionCommentsRepository(this.db);
  }

  private createCommentsService() {
    return new CommentsService(this.commentsRepository);
  }

  private createCommentsController() {
    return new CommentsController(this.commentsService, commentsErrorHandler);
  }

  public getCommentsRepository() {
    return this.commentsRepository;
  }

  public getCommentsService() {
    return this.commentsService;
  }

  public mountRouter(webServer: WebServer) {
    webServer.mountRouter("/comments", this.commentsController.getRouter());
  }
}
