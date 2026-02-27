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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VotesController = void 0;
const express_1 = __importDefault(require("express"));
const votesCommands_1 = require("./votesCommands");
class VotesController {
    constructor(votesService, errorHandler) {
        this.votesService = votesService;
        this.errorHandler = errorHandler;
        this.router = express_1.default.Router();
        this.setupRoutes();
        this.setupErrorHandler();
    }
    getRouter() {
        return this.router;
    }
    setupRoutes() {
        this.router.post("/post/:postId/new", this.castVoteOnPost.bind(this));
    }
    setupErrorHandler() {
        this.router.use(this.errorHandler);
    }
    castVoteOnPost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const command = new votesCommands_1.VoteOnPostCommand({
                    postId: req.params.postId,
                    voteType: req.body.voteType,
                    memberId: req.body.memberId
                });
                const result = yield this.votesService.castVoteOnPost(command);
                if (!result.isSuccess()) {
                    const error = result.getError();
                    return next(error);
                }
                else {
                    const postVote = result.getValue();
                    const response = {
                        success: true,
                        data: postVote.toDTO()
                    };
                    return res.status(200).json(response);
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.VotesController = VotesController;
