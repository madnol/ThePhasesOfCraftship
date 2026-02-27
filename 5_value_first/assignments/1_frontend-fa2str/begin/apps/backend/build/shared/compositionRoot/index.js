"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompositionRoot = void 0;
const commentsModule_1 = require("../../modules/comments/commentsModule");
const membersModule_1 = require("../../modules/members/membersModule");
const votesModule_1 = require("../../modules/votes/votesModule");
const database_1 = require("../database/database");
const eventOutboxTable_1 = require("@dddforum/outbox/eventOutboxTable");
const http_1 = require("../http");
const modules_1 = require("@dddforum/backend/src/modules");
const natsEventBus_1 = require("@dddforum/bus/natsEventBus");
class CompositionRoot {
    static createCompositionRoot(config) {
        if (!CompositionRoot.instance) {
            CompositionRoot.instance = new this(config);
        }
        return CompositionRoot.instance;
    }
    constructor(config) {
        this.config = config;
        // Create services
        this.dbConnection = this.createDBConnection();
        this.eventBus = this.createEventBus();
        this.eventsOutboxTable = this.createEventsTable();
        this.webServer = this.createWebServer();
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            // Start services
            yield this.dbConnection.connect();
            yield this.webServer.start();
            yield this.eventBus.initialize();
            // Connect modules starting with the root modules (generic)
            this.usersModule = this.createUsersModule();
            this.notificationsModule = this.createNotificationsModule();
            this.marketingModule = this.createMarketingModule();
            // Build the core modules
            this.membersModule = this.createMembersModule();
            this.postsModule = this.createPostsModule();
            this.commentsModule = this.createCommentsModule();
            this.votesModule = this.createVotesModule();
            this.mountRoutes();
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.webServer.stop();
            yield this.eventBus.stop();
        });
    }
    createEventsTable() {
        return new eventOutboxTable_1.EventOutboxTable(this.dbConnection.getConnection());
    }
    createCommentsModule() {
        return commentsModule_1.CommentsModule.build(this.dbConnection, this.config);
    }
    createMembersModule() {
        return membersModule_1.MembersModule.build(this.dbConnection, this.eventsOutboxTable, this.config);
    }
    createNotificationsModule() {
        return modules_1.NotificationsModule.build(this.eventBus, this.config);
    }
    createMarketingModule() {
        return modules_1.MarketingModule.build(this.config);
    }
    createUsersModule() {
        return modules_1.UsersModule.build(this.config);
    }
    createVotesModule() {
        return votesModule_1.VotesModule.build(this.dbConnection, 
        // TODO: just pass modules to each other entirely
        this.membersModule.getMembersRepository(), this.commentsModule.getCommentsRepository(), this.postsModule.getPostsRepository(), this.eventBus, this.eventsOutboxTable, this.config);
    }
    createPostsModule() {
        return modules_1.PostsModule.build(this.dbConnection, this.config, this.eventsOutboxTable, this.membersModule.getMembersRepository());
    }
    getEventOutboxTable() {
        return this.eventsOutboxTable;
    }
    getDatabase() {
        if (!this.dbConnection)
            this.createDBConnection();
        return this.dbConnection;
    }
    getEventBus() {
        return this.eventBus;
    }
    createEventBus() {
        return new natsEventBus_1.NatsEventBus();
    }
    createWebServer() {
        return new http_1.WebServer({ port: 3000, env: this.config.env });
    }
    getWebServer() {
        return this.webServer;
    }
    mountRoutes() {
        this.marketingModule.mountRouter(this.webServer);
        this.membersModule.mountRouter(this.webServer);
        this.postsModule.mountRouter(this.webServer);
        this.votesModule.mountRouter(this.webServer);
    }
    createDBConnection() {
        const dbConnection = new database_1.PrismaDatabase();
        if (!this.dbConnection) {
            this.dbConnection = dbConnection;
        }
        return dbConnection;
    }
    getApplication() {
        return {
            users: this.usersModule.getUsersService(),
            posts: this.postsModule.getPostsService(),
            marketing: this.marketingModule.getMarketingService(),
            notifications: this.notificationsModule.getNotificationsService(),
            votes: this.votesModule.getVotesService(),
        };
    }
    getTransactionalEmailAPI() {
        return this.notificationsModule.getTransactionalEmailAPI();
    }
    getContactListAPI() {
        return this.marketingModule.getContactListAPI();
    }
    getModule(moduleName) {
        switch (moduleName) {
            case 'members':
                return this.membersModule;
            case 'users':
                return this.usersModule;
            case 'posts':
                return this.postsModule;
            case 'votes':
                return this.votesModule;
            case 'notifications':
                return this.notificationsModule;
            case 'marketing':
                return this.marketingModule;
            default:
                throw new Error(`Module ${moduleName} not found`);
        }
    }
    getRepositories() {
        return {
            posts: this.postsModule.getPostsRepository(),
        };
    }
    shouldBuildFakeRepository() {
        return (this.config.getScript() === "test:unit" ||
            this.config.getEnvironment() === "development");
    }
}
exports.CompositionRoot = CompositionRoot;
CompositionRoot.instance = null;
