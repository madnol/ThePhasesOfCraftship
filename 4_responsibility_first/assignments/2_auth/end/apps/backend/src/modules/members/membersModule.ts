
import { Database } from "@dddforum/database";
import { WebServer } from "../../shared/http";
import { ApplicationModule } from "../../shared/modules/applicationModule";
import { MemberService } from "./application/membersService";
import { membersErrorHandler } from "./memberErrors";
import { MembersController } from "./membersController";
import { ProductionMembersRepository } from "./repos/adapters/productionMembersRepository";
import { MembersRepository } from "./repos/ports/membersRepository";
import { Config } from "@dddforum/config";
import { EventOutboxTable } from "@dddforum/outbox";
import { UsersServiceAPI } from "../users/externalServices/ports/usersServiceAPI";

export class MembersModule extends ApplicationModule {
  private membersRepository: MembersRepository;
  private memberService: MemberService
  private membersController: MembersController;

  private constructor(
    private db: Database,
    private eventsTable: EventOutboxTable,
    private usersServiceAPI: UsersServiceAPI,
    config: Config,
  ) {
    super(config);
    // Create the tree in reverse (repos, services, controllers)
    this.membersRepository = this.createMembersRepository();
    this.memberService = this.createMembersService();
    this.membersController = this.createMembersController(config, usersServiceAPI);
  }

  createMembersController (config: Config, usersService: UsersServiceAPI) {
    return new MembersController(this.memberService,  membersErrorHandler, config, usersService);
  }

  createMembersService () {
    return new MemberService(this.membersRepository, this.usersServiceAPI);
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
  
  public static build(db: Database, eventsTable: EventOutboxTable, usersService: UsersServiceAPI, config: Config) {
    return new MembersModule(db, eventsTable, usersService, config);
  }
}
