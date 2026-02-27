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
exports.ProductionVotesRepository = void 0;
const postVote_1 = require("../../../posts/domain/postVote");
const commentVote_1 = require("../../../comments/domain/commentVote");
const memberCommentVotesRoundup_1 = require("../../domain/memberCommentVotesRoundup");
const memberPostVotesRoundup_1 = require("../../domain/memberPostVotesRoundup");
class ProductionVotesRepository {
    constructor(prisma, eventsTable) {
        this.prisma = prisma;
        this.eventsTable = eventsTable;
    }
    getMemberCommentVotesRoundup(memberId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [allCommentsCount, allCommentsUpvoteCount, allCommentsDownvoteCount] = yield Promise.all([
                this.prisma.commentVote.count({
                    where: { memberId },
                }),
                this.prisma.commentVote.count({
                    where: {
                        commentBelongsTo: {
                            memberId,
                        },
                        value: 1
                    },
                }),
                this.prisma.commentVote.count({
                    where: {
                        commentBelongsTo: {
                            memberId,
                        },
                        value: -1
                    },
                })
            ]);
            const roundup = memberCommentVotesRoundup_1.MemberCommentVotesRoundup.toDomain({
                memberId, allCommentsCount, allCommentsUpvoteCount, allCommentsDownvoteCount
            });
            return roundup;
        });
    }
    getMemberPostVotesRoundup(memberId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [allPostsCount, allPostsUpvoteCount, allPostsDownvoteCount] = yield Promise.all([
                    this.prisma.postVote.count({
                        where: {
                            postBelongsTo: {
                                memberId
                            }
                        },
                    }),
                    this.prisma.postVote.count({
                        where: {
                            postBelongsTo: {
                                memberId
                            },
                            value: 1
                        },
                    }),
                    this.prisma.postVote.count({
                        where: {
                            postBelongsTo: {
                                memberId
                            },
                            value: -1
                        },
                    })
                ]);
                const roundup = memberPostVotesRoundup_1.MemberPostVotesRoundup.toDomain({
                    memberId, allPostsCount, allPostsUpvoteCount, allPostsDownvoteCount
                });
                return roundup;
            }
            catch (err) {
                console.log(err);
                throw new Error('Error getting member post votes roundup');
            }
        });
    }
    findVoteByMemberAndCommentId(memberId, commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const vote = yield this.prisma.commentVote.findUnique({
                where: {
                    memberId_commentId: {
                        memberId,
                        commentId
                    }
                }
            });
            if (!vote)
                return null;
            return commentVote_1.CommentVote.toDomain({
                id: vote.id,
                memberId: vote.memberId,
                commentId: vote.commentId,
                voteState: vote.value === 1 ? 'Upvoted' : vote.value === -1 ? 'Downvoted' : 'Default'
            });
        });
    }
    findVoteByMemberAndPostId(memberId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const vote = yield this.prisma.postVote.findUnique({
                where: {
                    memberId_postId: {
                        memberId,
                        postId
                    }
                }
            });
            if (!vote)
                return null;
            return postVote_1.PostVote.toDomain({
                id: vote.id,
                memberId: vote.memberId,
                postId: vote.postId,
                voteState: vote.value === 1 ? 'Upvoted' : vote.value === -1 ? 'Downvoted' : 'Default'
            });
        });
    }
    save(vote, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const prismaInstance = transaction || this.prisma;
            if (vote instanceof postVote_1.PostVote) {
                yield prismaInstance.postVote.upsert({
                    where: {
                        memberId_postId: {
                            memberId: vote.memberId,
                            postId: vote.postId
                        }
                    },
                    update: {
                        value: vote.getValue()
                    },
                    create: {
                        memberId: vote.memberId,
                        postId: vote.postId,
                        value: vote.getValue()
                    }
                });
            }
            else if (vote instanceof commentVote_1.CommentVote) {
                yield prismaInstance.commentVote.upsert({
                    where: {
                        memberId_commentId: {
                            memberId: vote.memberId,
                            commentId: vote.commentId
                        }
                    },
                    update: {
                        value: vote.getValue()
                    },
                    create: {
                        memberId: vote.memberId,
                        commentId: vote.commentId,
                        value: vote.getValue()
                    }
                });
            }
        });
    }
    saveAggregateAndEvents(vote, events) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                yield this.save(vote, tx);
                yield this.eventsTable.save(events, tx);
            }));
        });
    }
}
exports.ProductionVotesRepository = ProductionVotesRepository;
