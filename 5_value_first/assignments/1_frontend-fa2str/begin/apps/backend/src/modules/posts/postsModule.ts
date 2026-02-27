import { WebServer } from "../../shared/http/webServer";
import { ApplicationModule } from "../../shared/modules/applicationModule";
import { PostsController } from "./postsController";
import { postsErrorHandler } from "./postsErrors";
import { InMemoryPostsRepository } from "./repos/adapters/inMemoryPostsRepository";
import { ProductionPostsRepository } from "./repos/adapters/productionPostsRepository";
import { PostsRepository } from "./repos/ports/postsRepository";
import { MembersRepository } from "../members/repos/ports/membersRepository";
import { PostsService } from "./application/postsService";
import { EventOutboxTable } from "@dddforum/outbox";
import { Database, PrismaDatabase } from "@dddforum/database";
import { Config } from "@dddforum/config";
import { CommentsService } from "../comments/application/commentsService";

export class PostsModule extends ApplicationModule {
  private postsRepository: PostsRepository;
  private postsService: PostsService;
  private postsController: PostsController;

  private constructor(
    private db: Database,
    config: Config,
    private eventOutbox: EventOutboxTable,
    private membersRepository: MembersRepository,
    private commentsService: CommentsService,
  ) {
    super(config);
    this.postsRepository = this.createPostsRepository();
    this.postsService = this.createPostsService(membersRepository);
    this.postsController = this.createPostsController();
  }

  static build(
    db: PrismaDatabase, 
    config: Config, 
    eventOutbox: EventOutboxTable, 
    membersRepository: MembersRepository,
    commentsService: CommentsService
  ) {
    return new PostsModule(db, config, eventOutbox, membersRepository, commentsService);
  }

  private createPostsRepository() {
    if (this.postsRepository) return this.postsRepository;

    // if (this.shouldBuildFakeRepository) {
    //   return InMemoryPostsRepository.createWithSeedData();
    // }

    return new ProductionPostsRepository(this.db, this.eventOutbox);
  }

  private createPostsService(membersRepository: MembersRepository) {
    return new PostsService(this.postsRepository, membersRepository);
  }

  private createPostsController() {
    return new PostsController(this.postsService, this.commentsService, postsErrorHandler);
  }

  public getPostsController() {
    return this.postsController;
  }

  public mountRouter(webServer: WebServer) {
    webServer.mountRouter("/posts", this.postsController.getRouter());
  }

  public getPostsService() {
    return this.postsService;
  }

  public getPostsRepository() {
    return this.postsRepository;
  }
}
