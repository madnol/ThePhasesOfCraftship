"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VotesModule = void 0;
const applicationModule_1 = require("../../shared/modules/applicationModule");
const votesService_1 = require("./application/votesService");
const productionVotesRepo_1 = require("./repos/adapters/productionVotesRepo");
const votesSubscriptions_1 = require("./application/votesSubscriptions");
const votesController_1 = require("./votesController");
const votesErrors_1 = require("./votesErrors");
class VotesModule extends applicationModule_1.ApplicationModule {
    constructor(db, membersRepository, commentRepository, postsRepository, eventBus, eventsTable, config) {
        super(config);
        this.db = db;
        this.membersRepository = membersRepository;
        this.commentRepository = commentRepository;
        this.postsRepository = postsRepository;
        this.eventBus = eventBus;
        this.eventsTable = eventsTable;
        this.votesRepository = this.createVotesRepository();
        this.votesService = this.createVotesService();
        this.votesSubscriptions = this.createVotesSubscriptions();
        this.votesController = this.createVotesController();
    }
    static build(db, membersRepo, commentsRepo, postsRepo, eventBus, eventsTable, config) {
        return new VotesModule(db, membersRepo, commentsRepo, postsRepo, eventBus, eventsTable, config);
    }
    createVotesService() {
        return new votesService_1.VotesService(this.membersRepository, this.commentRepository, this.postsRepository, this.votesRepository);
    }
    createVotesSubscriptions() {
        return new votesSubscriptions_1.VotesSubscriptions(this.eventBus, this.votesService);
    }
    createVotesRepository() {
        if (this.votesRepository)
            return this.votesRepository;
        return new productionVotesRepo_1.ProductionVotesRepository(this.db.getConnection(), this.eventsTable);
    }
    getVotesRepository() {
        return this.votesRepository;
    }
    getVotesService() {
        return this.votesService;
    }
    createVotesController() {
        return new votesController_1.VotesController(this.votesService, votesErrors_1.votesErrorHandler);
    }
    mountRouter(webServer) {
        webServer.mountRouter("/votes", this.votesController.getRouter());
    }
}
exports.VotesModule = VotesModule;
