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
exports.VoteOnComment = void 0;
const src_1 = require("@dddforum/errors/src");
const canVoteOnComment_1 = require("./canVoteOnComment");
const commentVote_1 = require("../../../../comments/domain/commentVote");
class VoteOnComment {
    constructor(memberRepository, commentRepository, voteRepository) {
        this.memberRepository = memberRepository;
        this.commentRepository = commentRepository;
        this.voteRepository = voteRepository;
    }
    execute(request) {
        return __awaiter(this, void 0, void 0, function* () {
            let commentVote;
            const { memberId, commentId, voteType } = request.props;
            const [memberOrNull, commentOrNull, existingVoteOrNull] = yield Promise.all([
                this.memberRepository.getMemberById(memberId),
                this.commentRepository.getCommentById(commentId),
                this.voteRepository.findVoteByMemberAndCommentId(memberId, commentId)
            ]);
            if (memberOrNull === null) {
                return new src_1.ApplicationErrors.NotFoundError('member');
            }
            if (commentOrNull === null) {
                return new src_1.ApplicationErrors.NotFoundError('comment');
            }
            if (!canVoteOnComment_1.CanVoteOnCommentPolicy.isAllowed(memberOrNull)) {
                return new src_1.ApplicationErrors.PermissionError();
            }
            if (existingVoteOrNull) {
                commentVote = existingVoteOrNull;
            }
            else {
                let commentVoteOrError = commentVote_1.CommentVote.create(memberId, commentId);
                if (commentVoteOrError instanceof src_1.ApplicationErrors.ValidationError) {
                    return commentVoteOrError;
                }
                commentVote = commentVoteOrError;
            }
            commentVote.castVote(voteType);
            try {
                const domainEvents = commentVote.getDomainEvents();
                yield this.voteRepository.saveAggregateAndEvents(commentVote, domainEvents);
                return commentVote;
            }
            catch (error) {
                console.log(error);
                // TODO: Do this database error everywhere and test to make sure it's good
                return new src_1.ServerErrors.DatabaseError();
            }
        });
    }
}
exports.VoteOnComment = VoteOnComment;
