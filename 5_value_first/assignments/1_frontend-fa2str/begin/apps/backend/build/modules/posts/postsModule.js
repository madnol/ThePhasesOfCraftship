"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsModule = void 0;
const applicationModule_1 = require("../../shared/modules/applicationModule");
const postsController_1 = require("./postsController");
const postsErrors_1 = require("./postsErrors");
const inMemoryPostsRepository_1 = require("./repos/adapters/inMemoryPostsRepository");
const productionPostsRepository_1 = require("./repos/adapters/productionPostsRepository");
const postsService_1 = require("./application/postsService");
class PostsModule extends applicationModule_1.ApplicationModule {
    constructor(db, config, eventOutbox, membersRepository) {
        super(config);
        this.db = db;
        this.eventOutbox = eventOutbox;
        this.membersRepository = membersRepository;
        this.postsRepository = this.createPostsRepository();
        this.postsService = this.createPostsService(membersRepository);
        this.postsController = this.createPostsController();
    }
    static build(db, config, eventOutbox, membersRepository) {
        return new PostsModule(db, config, eventOutbox, membersRepository);
    }
    createPostsRepository() {
        if (this.postsRepository)
            return this.postsRepository;
        if (this.shouldBuildFakeRepository) {
            return inMemoryPostsRepository_1.InMemoryPostsRepository.createWithSeedData();
        }
        return new productionPostsRepository_1.ProductionPostsRepository(this.db.getConnection(), this.eventOutbox);
    }
    createPostsService(membersRepository) {
        return new postsService_1.PostsService(this.postsRepository, membersRepository);
    }
    createPostsController() {
        return new postsController_1.PostsController(this.postsService, postsErrors_1.postsErrorHandler);
    }
    getPostsController() {
        return this.postsController;
    }
    mountRouter(webServer) {
        webServer.mountRouter("/posts", this.postsController.getRouter());
    }
    getPostsService() {
        return this.postsService;
    }
    getPostsRepository() {
        return this.postsRepository;
    }
}
exports.PostsModule = PostsModule;
