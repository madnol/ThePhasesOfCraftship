import { ApplicationModule } from "../../shared/modules/applicationModule";
import { Database } from "@dddforum/database";
import { CommentRepository } from "./repos/ports/commentRepository";
import { ProductionCommentsRepository } from "./repos/adapters/productionCommentRepository";
import { CommentsService } from "./application/commentsService";
import { Config } from "@dddforum/config";
import { WebServer } from "../../shared/http/webServer";
import { CommentsController } from "./commentsController";
import { commentsErrorHandler } from "./commentsErrors";
import { PostsRepository } from "../posts/repos/ports/postsRepository";
import { ProductionPostsRepository } from "../posts/repos/adapters/productionPostsRepository";
import { MembersRepository } from "../members/repos/ports/membersRepository";
import { EventBus } from "@dddforum/bus";

export class CommentsModule extends ApplicationModule {
  private commentsRepository: CommentRepository;
  private postsRepository: PostsRepository;
  private commentsService: CommentsService;
  private commentsController: CommentsController;

  private constructor(
    private db: Database,
    membersRepo: MembersRepository,
    eventBus: EventBus,
    config: Config,
  ) {
    super(config);
    this.commentsRepository = this.createCommentRepository();
    this.postsRepository = this.createPostsRepository();
    this.commentsService = this.createCommentsService(membersRepo, eventBus);
    this.commentsController = this.createCommentsController();
  }

  static build(db: Database, config: Config, membersRepo: MembersRepository, eventBus: EventBus) {
    return new CommentsModule(db, membersRepo, eventBus, config);
  }

  private createCommentRepository() {
    if (this.commentsRepository) return this.commentsRepository;
    return new ProductionCommentsRepository(this.db);
  }

  private createPostsRepository() {
    if (this.postsRepository) return this.postsRepository;
    return new ProductionPostsRepository(this.db);
  }

  private createCommentsService(membersRepo: MembersRepository, eventBus: EventBus) {
    return new CommentsService(this.commentsRepository, this.postsRepository, membersRepo, eventBus);
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
    webServer.mountRouter("/", this.commentsController.getRouter());
  }
}
