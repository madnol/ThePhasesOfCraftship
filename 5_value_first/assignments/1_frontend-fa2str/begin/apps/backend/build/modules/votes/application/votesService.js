"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VotesService = void 0;
const voteOnComment_1 = require("../../comments/application/useCases/voteOnComment/voteOnComment");
const updateMemberReputationScore_1 = require("./useCases/updateMemberReputation/updateMemberReputationScore");
const voteOnPost_1 = require("./useCases/voteOnPost/voteOnPost");
class VotesService {
    constructor(memberRepository, commentRepository, postRepository, voteRepository) {
        this.memberRepository = memberRepository;
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
        this.voteRepository = voteRepository;
    }
    castVoteOnComment(command) {
        return new voteOnComment_1.VoteOnComment(this.memberRepository, this.commentRepository, this.voteRepository).execute(command);
    }
    castVoteOnPost(command) {
        return new voteOnPost_1.VoteOnPost(this.memberRepository, this.postRepository, this.voteRepository).execute(command);
    }
    updateMemberReputationScore(command) {
        return new updateMemberReputationScore_1.UpdateMemberReputationScore(this.memberRepository, this.voteRepository).execute(command);
    }
}
exports.VotesService = VotesService;
