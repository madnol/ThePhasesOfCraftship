"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
class Comment {
    constructor(props) {
        this.props = props;
    }
    vote(member, voteType) {
    }
    get id() {
        return this.props.id;
    }
    static toDomain(recreationProps) {
        return new Comment({
            id: recreationProps.id,
            text: recreationProps.text,
            postId: recreationProps.postId,
            memberId: recreationProps.memberId,
            parentCommentId: recreationProps.parentCommentId
        });
    }
}
exports.Comment = Comment;
