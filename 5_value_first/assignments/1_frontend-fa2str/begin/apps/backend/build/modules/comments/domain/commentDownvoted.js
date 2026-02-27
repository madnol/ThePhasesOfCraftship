"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentDownvoted = void 0;
const src_1 = require("@dddforum/core/src");
class CommentDownvoted extends src_1.DomainEvent {
    constructor(props, id, retries, status, createdAt) {
        super('CommentDownvoted', props, props.commentId, id, retries, status, createdAt);
    }
    static create(props) {
        return new CommentDownvoted(props);
    }
    static toDomain(eventModel) {
        const serializedData = JSON.parse(eventModel.data);
        // Validate this data here using zod or something
        return new CommentDownvoted({
            commentId: serializedData.commentId,
            memberId: serializedData.memberId
        }, eventModel.id, eventModel.retries, eventModel.status, eventModel.dateCreated.toISOString());
    }
}
exports.CommentDownvoted = CommentDownvoted;
