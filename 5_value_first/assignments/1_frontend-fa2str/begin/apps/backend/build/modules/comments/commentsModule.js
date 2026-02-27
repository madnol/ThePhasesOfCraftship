"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsModule = void 0;
const applicationModule_1 = require("../../shared/modules/applicationModule");
const productionCommentRepository_1 = require("./repos/adapters/productionCommentRepository");
const commentsService_1 = require("./application/commentsService");
class CommentsModule extends applicationModule_1.ApplicationModule {
    constructor(db, config) {
        super(config);
        this.db = db;
        this.commentsRepository = this.createCommentRepository();
    }
    static build(db, config) {
        return new CommentsModule(db, config);
    }
    createCommentRepository() {
        if (this.commentsRepository)
            return this.commentsRepository;
        return new productionCommentRepository_1.ProductionCommentsRepository(this.db.getConnection());
    }
    getCommentsRepository() {
        return this.commentsRepository;
    }
    getCommentsService() {
        // Not yet implemented
        return new commentsService_1.CommentsService();
    }
}
exports.CommentsModule = CommentsModule;
