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
exports.VoteOnPost = void 0;
const src_1 = require("@dddforum/errors/src");
const src_2 = require("@dddforum/core/src");
const canVoteOnPost_1 = require("./canVoteOnPost");
const postVote_1 = require("../../../../posts/domain/postVote");
class VoteOnPost {
    constructor(memberRepository, postRepository, voteRepository) {
        this.memberRepository = memberRepository;
        this.postRepository = postRepository;
        this.voteRepository = voteRepository;
    }
    execute(request) {
        return __awaiter(this, void 0, void 0, function* () {
            let postVote;
            const { memberId, postId, voteType } = request.props;
            const [memberOrNull, postOrNull, existingVoteOrNull] = yield Promise.all([
                this.memberRepository.getMemberById(memberId),
                this.postRepository.getPostDetailsById(postId),
                this.voteRepository.findVoteByMemberAndPostId(memberId, postId)
            ]);
            if (memberOrNull === null) {
                return (0, src_2.fail)(new src_1.ApplicationErrors.NotFoundError('member'));
            }
            if (postOrNull === null) {
                return (0, src_2.fail)(new src_1.ApplicationErrors.NotFoundError('post'));
            }
            if (!canVoteOnPost_1.CanVoteOnPostPolicy.isAllowed(memberOrNull)) {
                return (0, src_2.fail)(new src_1.ApplicationErrors.PermissionError());
                // TODO: these need to specify their policy
                // TODO: these need tests
            }
            if (existingVoteOrNull) {
                postVote = existingVoteOrNull;
            }
            else {
                let postVoteOrError = postVote_1.PostVote.create(memberId, postId);
                if (postVoteOrError instanceof src_1.ApplicationErrors.ValidationError) {
                    // TODO: should be using 'fail' all throughout
                    return (0, src_2.fail)(postVoteOrError);
                }
                postVote = postVoteOrError;
            }
            postVote.castVote(voteType);
            try {
                const domainEvents = postVote.getDomainEvents();
                yield this.voteRepository.saveAggregateAndEvents(postVote, domainEvents);
                return (0, src_2.success)(postVote);
            }
            catch (error) {
                console.log(error);
                // TODO: should encapsulate the database error
                return (0, src_2.fail)(new src_1.ServerErrors.DatabaseError());
            }
        });
    }
}
exports.VoteOnPost = VoteOnPost;
