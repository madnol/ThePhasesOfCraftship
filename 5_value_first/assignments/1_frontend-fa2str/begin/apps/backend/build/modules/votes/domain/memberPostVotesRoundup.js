"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberPostVotesRoundup = void 0;
const src_1 = require("@dddforum/core/src");
class MemberPostVotesRoundup extends src_1.ReadModel {
    constructor(props) {
        super(props);
    }
    get memberId() {
        return this.props.memberId;
    }
    getScore() {
        return this.props.allPostsUpvoteCount - this.props.allPostsDownvoteCount;
    }
    static toDomain(props) {
        return new MemberPostVotesRoundup(props);
    }
}
exports.MemberPostVotesRoundup = MemberPostVotesRoundup;
