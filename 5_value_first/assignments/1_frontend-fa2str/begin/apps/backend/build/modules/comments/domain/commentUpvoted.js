"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentUpvoted = void 0;
const src_1 = require("@dddforum/core/src");
class CommentUpvoted extends src_1.DomainEvent {
    constructor(props, id, retries, status, createdAt) {
        super('CommentUpvoted', props, props.commentId, id, retries, status, createdAt);
    }
    static create(props) {
        return new CommentUpvoted(props);
    }
    static toDomain(eventModel) {
        const serializedData = JSON.parse(eventModel.data);
        // Validate this data here using zod or something
        return new CommentUpvoted({
            commentId: serializedData.commentId,
            memberId: serializedData.memberId
        }, eventModel.id, eventModel.retries, eventModel.status, eventModel.dateCreated.toISOString());
    }
}
exports.CommentUpvoted = CommentUpvoted;
