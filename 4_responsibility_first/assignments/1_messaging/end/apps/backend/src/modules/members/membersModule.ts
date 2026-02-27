
import { Database } from "@dddforum/database";
import { WebServer } from "../../shared/http";
import { ApplicationModule } from "../../shared/modules/applicationModule";
import { MemberService } from "./application/membersService";
import { membersErrorHandler } from "./memberErrors";
import { MembersController } from "./membersController";
import { ProductionMembersRepository } from "./repos/adapters/productionMembersRepository";
import { MembersRepository } from "./repos/ports/membersRepository";
import { Config } from "@dddforum/config";
import { EventBus } from "@dddforum/bus";
import { EventOutboxTable } from "@dddforum/outbox";

export class MembersModule extends ApplicationModule {
  private membersRepository: MembersRepository;
  private memberService: MemberService
  private membersController: MembersController;

  private constructor(
    private db: Database,
    private eventsTable: EventOutboxTable,
    config: Config,
  ) {
    super(config);
    // Create the tree in reverse (repos, services, controllers)
    this.membersRepository = this.createMembersRepository();
    this.memberService = this.createMembersService();
    this.membersController = this.createMembersController(config);
  }

  createMembersController (config: Config) {
    return new MembersController(this.memberService,  membersErrorHandler, config);
  }

  createMembersService () {
    return new MemberService(this.membersRepository);
  }

  getMemberRepository () {
    return this.membersRepository;
  }
  
  createMembersRepository () {
    return new ProductionMembersRepository(this.db, this.eventsTable)
  }

  getMembersRepository () {
    return this.membersRepository;
  }

  public mountRouter(webServer: WebServer) {
    webServer.mountRouter("/members", this.membersController.getRouter());
  }
  
  public static build(db: Database, eventsTable: EventOutboxTable, config: Config) {
    return new MembersModule(db, eventsTable, config);
  }
}
