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
exports.VotesSubscriptions = void 0;
const commentUpvoted_1 = require("../../comments/domain/commentUpvoted");
const commentDownvoted_1 = require("../../comments/domain/commentDownvoted");
const votesCommands_1 = require("../votesCommands");
const postCreated_1 = require("../../posts/domain/postCreated");
const postUpvoted_1 = require("../../posts/domain/postUpvoted");
const postDownvoted_1 = require("../../posts/domain/postDownvoted");
class VotesSubscriptions {
    constructor(eventBus, voteService) {
        this.eventBus = eventBus;
        this.voteService = voteService;
        this.setupSubscriptions();
    }
    setupSubscriptions() {
        this.eventBus.subscribe(commentUpvoted_1.CommentUpvoted.name, this.onCommentUpvotedUpdateReputationScore.bind(this));
        this.eventBus.subscribe(commentDownvoted_1.CommentDownvoted.name, this.onCommentDownvotedUpdateReputationScore.bind(this));
        this.eventBus.subscribe(postUpvoted_1.PostUpvoted.name, this.onPostUpvotedUpdateReputationScore.bind(this));
        this.eventBus.subscribe(postDownvoted_1.PostDownvoted.name, this.onPostDownvotedUpdateReputationScore.bind(this));
        this.eventBus.subscribe(postCreated_1.PostCreated.name, this.onPostCreatedCastInitialUpvote.bind(this));
    }
    onPostCreatedCastInitialUpvote(event) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const command = new votesCommands_1.VoteOnPostCommand({
                    postId: event.data.postId,
                    voteType: 'upvote',
                    memberId: event.data.memberId
                });
                yield this.voteService.castVoteOnPost(command);
            }
            catch (error) {
                console.log(error);
                // Handle
            }
        });
    }
    onPostUpvotedUpdateReputationScore(event) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const command = new votesCommands_1.UpdateMemberReputationScoreCommand({
                    memberId: event.data.memberId
                });
                yield this.voteService.updateMemberReputationScore(command);
            }
            catch (error) {
                console.log(error);
                // Handle
            }
        });
    }
    onPostDownvotedUpdateReputationScore(event) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const command = new votesCommands_1.UpdateMemberReputationScoreCommand({
                    memberId: event.data.memberId
                });
                yield this.voteService.updateMemberReputationScore(command);
            }
            catch (error) {
                console.log(error);
                // Handle
            }
        });
    }
    onCommentUpvotedUpdateReputationScore(event) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const command = new votesCommands_1.UpdateMemberReputationScoreCommand({
                    memberId: event.data.memberId
                });
                yield this.voteService.updateMemberReputationScore(command);
            }
            catch (error) {
                console.log(error);
                // Handle
            }
        });
    }
    onCommentDownvotedUpdateReputationScore(event) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const command = new votesCommands_1.UpdateMemberReputationScoreCommand({
                    memberId: event.data.memberId
                });
                yield this.voteService.updateMemberReputationScore(command);
            }
            catch (error) {
                console.log(error);
                // Handle
            }
        });
    }
}
exports.VotesSubscriptions = VotesSubscriptions;
