"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostVote = void 0;
const src_1 = require("@dddforum/core/src");
const crypto_1 = require("crypto");
const postUpvoted_1 = require("./postUpvoted");
const postDownvoted_1 = require("./postDownvoted");
class PostVote extends src_1.AggregateRoot {
    constructor(props) {
        super();
        this.props = props;
    }
    get id() {
        return this.props.id;
    }
    get memberId() {
        return this.props.memberId;
    }
    get postId() {
        return this.props.postId;
    }
    get voteState() {
        return this.props.voteState;
    }
    getValue() {
        switch (this.props.voteState) {
            case 'Upvoted':
                return 1;
            case 'Downvoted':
                return -1;
            default:
                return 0;
        }
    }
    castVote(voteType) {
        if (voteType === 'upvote') {
            this.upvote();
        }
        else {
            this.downvote();
        }
    }
    upvote() {
        if (this.props.voteState === 'Upvoted') {
            return;
        }
        const domainEvent = postUpvoted_1.PostUpvoted.create({
            memberId: this.props.memberId,
            postId: this.props.postId,
            postVoteId: this.id
        });
        this.props.voteState = 'Upvoted';
        this.domainEvents.push(domainEvent);
    }
    downvote() {
        if (this.props.voteState === 'Downvoted') {
            return;
        }
        const domainEvent = postDownvoted_1.PostDownvoted.create({
            memberId: this.props.memberId,
            postId: this.props.postId,
            postVoteId: this.id
        });
        this.props.voteState = 'Downvoted';
        this.domainEvents.push(domainEvent);
    }
    static toDomain(props) {
        return new PostVote(props);
    }
    static create(memberId, postId) {
        return new PostVote({
            id: (0, crypto_1.randomUUID)(),
            memberId: memberId,
            postId: postId,
            voteState: 'Default'
        });
    }
    toDTO() {
        return {
            memberId: this.props.memberId,
            postId: this.props.postId,
            voteType: this.props.voteState === 'Upvoted' ? 'upvote' : 'downvote'
        };
    }
}
exports.PostVote = PostVote;
