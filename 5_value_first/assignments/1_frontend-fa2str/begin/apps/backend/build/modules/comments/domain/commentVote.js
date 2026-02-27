"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentVote = void 0;
const src_1 = require("@dddforum/core/src");
const crypto_1 = require("crypto");
const commentUpvoted_1 = require("./commentUpvoted");
const commentDownvoted_1 = require("./commentDownvoted");
class CommentVote extends src_1.AggregateRoot {
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
    get commentId() {
        return this.props.commentId;
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
        this.props.voteState = 'Upvoted';
        const commentUpvote = commentUpvoted_1.CommentUpvoted.create({ commentId: this.commentId, memberId: this.memberId });
        this.domainEvents.push(commentUpvote);
    }
    downvote() {
        if (this.props.voteState === 'Downvoted') {
            return;
        }
        this.props.voteState = 'Downvoted';
        const commentDownvote = commentDownvoted_1.CommentDownvoted.create({ commentId: this.commentId, memberId: this.memberId });
        this.domainEvents.push(commentDownvote);
    }
    static toDomain(props) {
        return new CommentVote(props);
    }
    static create(memberId, commentId) {
        return new CommentVote({
            id: (0, crypto_1.randomUUID)(),
            memberId: memberId,
            commentId: commentId,
            voteState: 'Default'
        });
    }
    static createUpvote(memberId, commentId) {
        return new CommentVote({
            id: (0, crypto_1.randomUUID)(),
            memberId: memberId,
            commentId: commentId,
            voteState: 'Upvoted'
        });
    }
    static createDownvote(memberId, commentId) {
        return new CommentVote({
            id: (0, crypto_1.randomUUID)(),
            memberId: memberId,
            commentId: commentId,
            voteState: 'Downvoted'
        });
    }
}
exports.CommentVote = CommentVote;
