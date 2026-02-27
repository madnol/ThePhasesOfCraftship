
import { ApplicationModule } from "../../shared/modules/applicationModule";

import { WebServer } from "../../shared/http/webServer";
import { UsersController } from "./usersController";
import { userErrorHandler } from "./usersErrors"; // You'll need to create this
import { FirebaseAuth } from "./externalServices/adapters/firebaseAuth";
import { Config } from "@dddforum/config";
import { UsersServiceAPI } from "./externalServices/ports/usersServiceAPI";
import { MockFirebaseAuth } from "./externalServices/adapters/mockFirebaseAuth";

export class UsersModule extends ApplicationModule {
  private usersServiceAPI: UsersServiceAPI;
  private usersController: UsersController;

  private constructor(
    config: Config,
  ) {
    super(config);
    // Build external services + repos, then services, then controllers

    this.usersServiceAPI = this.createAuthServiceAPI(config);
    this.usersController = this.createUsersController(config);
  }

  private createAuthServiceAPI(config: Config) {
    if (config.script === 'test:e2e') {
      return new MockFirebaseAuth();
    }
    return new FirebaseAuth();
  }

  private createUsersController(config: Config) {
    return new UsersController(config, userErrorHandler);
  }

  static build(config: Config) {
    return new UsersModule(config);
  }

  public getUsersServiceAPI() {
    return this.usersServiceAPI;
  }

  public mountRouter(webServer: WebServer) {
    webServer.mountRouter("/users", this.usersController.getRouter());
  }
}
