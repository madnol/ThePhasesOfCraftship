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
exports.ProductionPostsRepository = void 0;
const exceptions_1 = require("../../../../shared/exceptions");
const post_1 = require("../../domain/post");
const postReadModel_1 = require("../../domain/postReadModel");
const commentReadModel_1 = require("../../domain/commentReadModel");
const memberReadModel_1 = require("../../../members/domain/memberReadModel");
class ProductionPostsRepository {
    constructor(prisma, eventsTable) {
        this.prisma = prisma;
        this.eventsTable = eventsTable;
    }
    saveAggregateAndEvents(post, events) {
        return this.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
            yield this.save(post, tx);
            yield this.eventsTable.save(events, tx);
        }));
    }
    getPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield this.prisma.post.findUnique({
                where: { id },
                include: {
                    memberPostedBy: true,
                    comments: {
                        include: {
                            memberPostedBy: true
                        }
                    },
                },
            });
            if (!post) {
                return null;
            }
            return post_1.Post.toDomain(post);
        });
    }
    findPosts(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const sqlQuery = {
                orderBy: {},
                include: {
                    memberPostedBy: true,
                    comments: {
                        include: {
                            memberPostedBy: true
                        }
                    },
                    _count: {
                        select: {
                            comments: true,
                        },
                    },
                },
            };
            if (query.sort === "popular") {
                sqlQuery.orderBy = { voteScore: "desc" };
            }
            if (query.sort === "recent") {
                sqlQuery.orderBy = { dateCreated: "desc" };
            }
            const posts = yield this.prisma.post.findMany(sqlQuery);
            return posts.map((post) => postReadModel_1.PostReadModel.fromPrismaToDomain(post, memberReadModel_1.MemberReadModel.fromPrisma(post.memberPostedBy), post.comments.map((c) => commentReadModel_1.CommentReadModel.fromPrismaToDomain(c, memberReadModel_1.MemberReadModel.fromPrisma(c.memberPostedBy)))));
        });
    }
    getPostDetailsById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield this.prisma.post.findUnique({
                where: { id },
                include: {
                    memberPostedBy: true,
                    comments: {
                        include: {
                            memberPostedBy: true
                        }
                    },
                    _count: {
                        select: {
                            comments: true,
                        },
                    },
                },
            });
            if (!post) {
                return null;
            }
            const voteScore = yield this.prisma.postVote.aggregate({
                _sum: { value: true },
                where: { postId: id },
            }).then(result => result._sum.value || 0);
            return postReadModel_1.PostReadModel.fromPrismaToDomain(Object.assign(Object.assign({}, post), { voteScore }), memberReadModel_1.MemberReadModel.fromPrisma(post.memberPostedBy), post.comments.map((c) => commentReadModel_1.CommentReadModel.fromPrismaToDomain(c, memberReadModel_1.MemberReadModel.fromPrisma(c.memberPostedBy))));
        });
    }
    save(post, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const prismaInstance = transaction ? transaction : this.prisma;
            try {
                yield prismaInstance.post.upsert({
                    where: { id: post.id },
                    update: {
                        title: post.title,
                        content: post.content,
                        voteScore: post.voteScore,
                        memberId: post.memberId,
                    },
                    create: {
                        id: post.id,
                        title: post.title,
                        postType: post.postType,
                        content: post.content,
                        link: post.link,
                        voteScore: post.voteScore,
                        memberId: post.memberId
                    },
                });
            }
            catch (error) {
                console.log(error);
                throw new exceptions_1.DatabaseError();
            }
        });
    }
}
exports.ProductionPostsRepository = ProductionPostsRepository;
