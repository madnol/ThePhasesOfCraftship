"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberCommentVotesRoundup = void 0;
const src_1 = require("@dddforum/core/src");
class MemberCommentVotesRoundup extends src_1.ReadModel {
    constructor(props) {
        super(props);
    }
    get memberId() {
        return this.props.memberId;
    }
    getScore() {
        return this.props.allCommentsUpvoteCount - this.props.allCommentsDownvoteCount;
    }
    static toDomain(props) {
        return new MemberCommentVotesRoundup(props);
    }
}
exports.MemberCommentVotesRoundup = MemberCommentVotesRoundup;
