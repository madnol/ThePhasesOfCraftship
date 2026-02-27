"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostCreated = void 0;
const src_1 = require("@dddforum/core/src");
class PostCreated extends src_1.DomainEvent {
    constructor(props, id, retries, status, createdAt) {
        super('PostCreated', props, props.postId, id, retries, status, createdAt);
    }
    static create(props) {
        return new PostCreated(props);
    }
    static toDomain(eventModel) {
        const serializedData = JSON.parse(eventModel.data);
        // Validate this data here using zod or something
        return new PostCreated({
            postId: serializedData.postId,
            memberId: serializedData.memberId
        }, eventModel.id, eventModel.retries, eventModel.status, eventModel.dateCreated.toISOString());
    }
}
exports.PostCreated = PostCreated;
