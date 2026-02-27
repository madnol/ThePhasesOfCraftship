"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Votes = exports.Vote = void 0;
const src_1 = require("@dddforum/core/src");
class Vote {
    constructor(props) {
        this.props = props;
    }
    get memberId() {
        return this.props.memberId;
    }
    isUpvote() {
        return this.props.voteStatus === 'Upvote';
    }
    static create(props) {
        return new Vote(props);
    }
}
exports.Vote = Vote;
class Votes extends src_1.Collection {
    constructor(votes) {
        super(votes);
    }
    getFirst() {
        return this.first();
    }
    addUpvote(memberId, postId) {
        this.add(Vote.create({ voteStatus: 'Upvote', memberId, postId }));
    }
    static create() {
        return new Votes([]);
    }
}
exports.Votes = Votes;
