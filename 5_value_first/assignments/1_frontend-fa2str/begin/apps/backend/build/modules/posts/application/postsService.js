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
exports.PostsService = void 0;
const createPost_1 = require("./useCases/createPost/createPost");
class PostsService {
    constructor(postsRepo, membersRepo) {
        this.postsRepo = postsRepo;
        this.membersRepo = membersRepo;
    }
    getPosts(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.postsRepo.findPosts(query);
        });
    }
    createPost(command) {
        return __awaiter(this, void 0, void 0, function* () {
            return new createPost_1.CreatePost(this.postsRepo, this.membersRepo).execute(command);
        });
    }
    getPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.postsRepo.getPostById(id);
        });
    }
    getPostDetailsById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.postsRepo.getPostDetailsById(id);
        });
    }
}
exports.PostsService = PostsService;
