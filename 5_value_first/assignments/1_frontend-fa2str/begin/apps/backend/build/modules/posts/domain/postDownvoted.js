"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostDownvoted = void 0;
const src_1 = require("@dddforum/core/src");
class PostDownvoted extends src_1.DomainEvent {
    constructor(props, id, retries, status, createdAt) {
        super('PostDownvoted', props, props.postVoteId, id, retries, status, createdAt);
    }
    static create(props) {
        return new PostDownvoted(props);
    }
    static toDomain(eventModel) {
        const serializedData = JSON.parse(eventModel.data);
        // Validate this data here using zod or something
        return new PostDownvoted({
            postVoteId: eventModel.aggregateId,
            postId: serializedData.postId,
            memberId: serializedData.memberId
        }, eventModel.id, eventModel.retries, eventModel.status, eventModel.dateCreated.toISOString());
    }
}
exports.PostDownvoted = PostDownvoted;
