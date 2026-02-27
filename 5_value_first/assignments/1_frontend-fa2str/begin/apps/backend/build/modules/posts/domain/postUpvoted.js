"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostUpvoted = void 0;
const src_1 = require("@dddforum/core/src");
class PostUpvoted extends src_1.DomainEvent {
    constructor(props, id, retries, status, createdAt) {
        super('PostUpvoted', props, props.postVoteId, id, retries, status, createdAt);
    }
    static create(props) {
        return new PostUpvoted(props);
    }
    static toDomain(eventModel) {
        const serializedData = JSON.parse(eventModel.data);
        // Validate this data here using zod or something
        return new PostUpvoted({
            postVoteId: eventModel.aggregateId,
            postId: serializedData.postId,
            memberId: serializedData.memberId
        }, eventModel.id, eventModel.retries, eventModel.status, eventModel.dateCreated.toISOString());
    }
}
exports.PostUpvoted = PostUpvoted;
