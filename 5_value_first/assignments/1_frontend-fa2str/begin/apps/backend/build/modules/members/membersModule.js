"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembersModule = void 0;
const applicationModule_1 = require("../../shared/modules/applicationModule");
const membersService_1 = require("./application/membersService");
const memberErrors_1 = require("./memberErrors");
const membersController_1 = require("./membersController");
const productionMembersRepository_1 = require("./repos/adapters/productionMembersRepository");
class MembersModule extends applicationModule_1.ApplicationModule {
    constructor(db, eventOutbox, config) {
        super(config);
        this.eventOutbox = eventOutbox;
        // Create the tree in reverse (repos, services, controllers)
        this.membersRepository = this.createMembersRepository(db);
        this.memberService = this.createMembersService();
        this.membersController = this.createMembersController(config);
    }
    createMembersController(config) {
        return new membersController_1.MembersController(this.memberService, memberErrors_1.membersErrorHandler, config);
    }
    createMembersService() {
        return new membersService_1.MemberService(this.membersRepository);
    }
    getMemberRepository() {
        return this.membersRepository;
    }
    createMembersRepository(db) {
        return new productionMembersRepository_1.ProductionMembersRepository(db.getConnection(), this.eventOutbox);
    }
    getMembersRepository() {
        return this.membersRepository;
    }
    mountRouter(webServer) {
        webServer.mountRouter("/members", this.membersController.getRouter());
    }
    static build(db, eventOutbox, config) {
        return new MembersModule(db, eventOutbox, config);
    }
}
exports.MembersModule = MembersModule;
