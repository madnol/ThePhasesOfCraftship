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
import { MembersRepository } from "../members/repos/ports/membersRepository";
import { EventBus } from "@dddforum/bus";
import { EventOutboxTable } from "@dddforum/outbox";

export class CommentsModule extends ApplicationModule {
  private commentsRepository: CommentRepository;
  private commentsService: CommentsService;
  private commentsController: CommentsController;

  private constructor(
    private db: Database,
    private postsRepo: PostsRepository,
    membersRepo: MembersRepository,
    eventBus: EventBus,
    private eventsTable: EventOutboxTable,
    config: Config,
  ) {
    super(config);
    this.commentsRepository = this.createCommentRepository();
    this.commentsService = this.createCommentsService(membersRepo, eventBus);
    this.commentsController = this.createCommentsController();
  }

  static build(db: Database, config: Config, postRepo: PostsRepository, membersRepo: MembersRepository, eventBus: EventBus, eventsTable: EventOutboxTable) {
    return new CommentsModule(db, postRepo, membersRepo, eventBus, eventsTable, config);
  }

  private createCommentRepository() {
    if (this.commentsRepository) return this.commentsRepository;
    return new ProductionCommentsRepository(this.db, this.eventsTable);
  }

  private createCommentsService(membersRepo: MembersRepository, eventBus: EventBus) {
    return new CommentsService(this.commentsRepository, this.postsRepo, membersRepo, eventBus);
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
