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
exports.PostsController = void 0;
const express_1 = __importDefault(require("express"));
const posts_1 = require("@dddforum/api/src/posts");
class PostsController {
    constructor(postsService, errorHandler) {
        this.postsService = postsService;
        this.errorHandler = errorHandler;
        this.router = express_1.default.Router();
        this.setupRoutes();
        this.setupErrorHandler();
    }
    getRouter() {
        return this.router;
    }
    setupRoutes() {
        this.router.get("/", this.getPosts.bind(this));
        this.router.post("/new", this.createPost.bind(this));
        this.router.get('/:postId', this.getPostById.bind(this));
    }
    setupErrorHandler() {
        this.router.use(this.errorHandler);
    }
    getPosts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = posts_1.Queries.GetPostsQuery.fromRequest(req.query);
                const posts = yield this.postsService.getPosts(query);
                const response = {
                    success: true,
                    data: posts.map((p) => p.toDTO()),
                };
                return res.status(200).json(response);
            }
            catch (error) {
                next(error);
            }
        });
    }
    createPost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const command = posts_1.Commands.CreatePostCommand.fromRequest(req.body);
                const result = yield this.postsService.createPost(command);
                if (!result.isSuccess()) {
                    const error = result.getError();
                    return next(error);
                }
                else {
                    const newPost = result.getValue();
                    const postDetails = yield this.postsService.getPostDetailsById(newPost.id);
                    if (!postDetails) {
                        // Improvement: Handle these consistently and with strict types
                        return res.status(500).json({
                            success: false,
                            data: undefined,
                            error: {
                                code: "ServerError",
                                message: "Server error: post created but could not be retrieved."
                            }
                        });
                    }
                    const response = {
                        success: true,
                        data: postDetails === null || postDetails === void 0 ? void 0 : postDetails.toDTO()
                    };
                    return res.status(200).json(response);
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    getPostById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = posts_1.Queries.GetPostByIdQuery.fromRequest(req);
                const postOrNothing = yield this.postsService.getPostDetailsById(query.postId);
                if (postOrNothing === null) {
                    // Improvement: Handle these consistently and with strict types
                    return res.status(404).json({
                        success: false,
                        data: undefined,
                        error: {
                            code: "PostNotFound",
                            message: "Post not found."
                        }
                    });
                }
                else {
                    const response = {
                        success: true,
                        data: postOrNothing.toDTO()
                    };
                    // Improvement: Handle these consistently and with strict types
                    return res.status(200).json(response);
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.PostsController = PostsController;
