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
exports.UpdateMemberReputationScore = void 0;
const src_1 = require("@dddforum/errors/src");
// Note: This is also something which could be done on a cron job
// We could have a cron job that runs every 24 hours and updates the reputation score of all members using 
// the read models. This would be a good way to ensure that the reputation score is always up to date.
class UpdateMemberReputationScore {
    constructor(memberRepository, votesRepository) {
        this.memberRepository = memberRepository;
        this.votesRepository = votesRepository;
    }
    execute(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const { memberId } = request.props;
            const [memberOrNull, commentVotesRoundup, postVotesRoundup] = yield Promise.all([
                this.memberRepository.getMemberById(memberId),
                this.votesRepository.getMemberCommentVotesRoundup(memberId),
                this.votesRepository.getMemberPostVotesRoundup(memberId)
            ]);
            if (memberOrNull === null) {
                return new src_1.ApplicationErrors.NotFoundError('member');
            }
            // Get the current score from the read models for this member to calculate
            // We calculate the score by:
            // - all comment upvotes not owned by this member (score)
            // - all post upvotes not owned by this member (score)
            let newScore = commentVotesRoundup.getScore()
                + postVotesRoundup.getScore();
            // This is another great example and reason for why we need read models.
            // More optimized queries.
            memberOrNull.updateReputationScore(newScore);
            yield this.memberRepository.saveAggregateAndEvents(memberOrNull, memberOrNull.getDomainEvents());
            // There's a chance that the member's reputation level has changed as a result of the 
            // new score as well.
            // await this.eventBus.publishEvents(memberOrNull.getDomainEvents());
            return memberOrNull;
        });
    }
}
exports.UpdateMemberReputationScore = UpdateMemberReputationScore;
