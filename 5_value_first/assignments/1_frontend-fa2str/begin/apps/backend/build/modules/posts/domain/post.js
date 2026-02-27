"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const src_1 = require("@dddforum/errors/src");
// TODO: consider relying upon errors from 'apis'
const node_crypto_1 = require("node:crypto");
const zod_1 = require("zod");
const src_2 = require("@dddforum/core/src");
const postCreated_1 = require("./postCreated");
const createTextPostSchema = zod_1.z.object({
    title: zod_1.z.string().min(5).max(100),
    content: zod_1.z.string().min(5).max(3000).optional(),
});
const createLinkPostSchema = zod_1.z.object({
    title: zod_1.z.string().min(5).max(100),
    link: zod_1.z.string().url(),
});
class Post extends src_2.AggregateRoot {
    constructor(props) {
        super();
        this.props = props;
    }
    get id() {
        return this.props.id;
    }
    get title() {
        return this.props.title;
    }
    get link() {
        return this.props.link;
    }
    get memberId() {
        return this.props.memberId;
    }
    get content() {
        return this.props.content;
    }
    get postType() {
        return this.props.postType;
    }
    get voteScore() {
        return this.props.voteScore;
    }
    static create(input) {
        const isTextPost = input.postType === 'text';
        if (isTextPost) {
            const validationResult = createTextPostSchema.safeParse(input);
            if (!validationResult.success) {
                return new src_1.ApplicationErrors.ValidationError(validationResult.error.errors.map(e => e.message).join(", "));
            }
        }
        else {
            const linkPostValidationResult = createLinkPostSchema.safeParse(input);
            if (!linkPostValidationResult.success) {
                return new src_1.ApplicationErrors.ValidationError(linkPostValidationResult.error.errors.map(e => e.message).join(", "));
            }
        }
        const postId = (0, node_crypto_1.randomUUID)();
        const post = new Post(Object.assign(Object.assign({}, input), { voteScore: 0, id: postId }));
        const postCreated = postCreated_1.PostCreated.create({ memberId: input.memberId, postId });
        post.domainEvents.push(postCreated);
        return post;
    }
    static toDomain(prismaModel) {
        return new Post({
            id: prismaModel.id,
            memberId: prismaModel.memberId,
            title: prismaModel.title,
            content: prismaModel.content ? prismaModel.content : undefined,
            link: prismaModel.link ? prismaModel.link : undefined,
            postType: prismaModel.postType,
            voteScore: prismaModel.voteScore
        });
    }
}
exports.Post = Post;
