"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const userIdentityService_1 = require("./application/userIdentityService");
const applicationModule_1 = require("../../shared/modules/applicationModule");
const usersController_1 = require("./usersController");
const usersErrors_1 = require("./usersErrors"); // You'll need to create this
const firebaseAuth_1 = require("./externalServices/adapters/firebaseAuth");
class UsersModule extends applicationModule_1.ApplicationModule {
    constructor(config) {
        super(config);
        // Build external services + repos, then services, then controllers
        this.identityServiceAPI = this.createIdentityServiceAPI(config);
        this.usersService = this.createUsersService();
        this.usersController = this.createUsersController(config);
    }
    createIdentityServiceAPI(config) {
        return new firebaseAuth_1.FirebaseAuth();
    }
    createUsersService() {
        return new userIdentityService_1.UserIdentityService(this.identityServiceAPI);
    }
    createUsersController(config) {
        return new usersController_1.UsersController(config, usersErrors_1.userErrorHandler);
    }
    static build(config) {
        return new UsersModule(config);
    }
    getUsersService() {
        return this.usersService;
    }
    mountRouter(webServer) {
        webServer.mountRouter("/users", this.usersController.getRouter());
    }
}
exports.UsersModule = UsersModule;
