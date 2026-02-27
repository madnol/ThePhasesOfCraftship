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
exports.InMemoryPostsRepository = void 0;
class InMemoryPostsRepository {
    constructor(posts) {
        this.posts = posts ? posts : [];
    }
    saveAggregateAndEvents(post, events) {
        throw new Error("Method not implemented.");
    }
    getPostById(id) {
        throw new Error("Method not implemented.");
    }
    findPosts(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.posts;
        });
    }
    static createWithSeedData() {
        // Put seed data here
        return new InMemoryPostsRepository();
    }
    save(post) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve();
        });
    }
    getPostDetailsById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.posts.find(post => post.id === id) || null;
        });
    }
}
exports.InMemoryPostsRepository = InMemoryPostsRepository;
