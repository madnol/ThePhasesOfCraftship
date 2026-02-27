"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostReadModel = void 0;
class PostReadModel {
    constructor(props) {
        this.props = props;
    }
    get id() {
        return this.props.id;
    }
    static fromPrismaToDomain(prismaPost, member, comments) {
        return new PostReadModel({
            id: prismaPost.id,
            title: prismaPost.title,
            content: prismaPost.content ? prismaPost.content : undefined,
            link: prismaPost.link ? prismaPost.link : undefined,
            member: member,
            comments: comments,
            voteScore: prismaPost.voteScore,
            postType: prismaPost.postType,
            dateCreated: prismaPost.dateCreated.toISOString(),
            lastUpdated: prismaPost.lastUpdated.toISOString()
        });
    }
    toDTO() {
        return {
            id: this.props.id,
            title: this.props.title,
            content: this.props.content,
            postType: this.props.postType,
            dateCreated: this.props.dateCreated,
            lastUpdated: this.props.lastUpdated,
            member: this.props.member.toDTO(),
            comments: this.props.comments.map((c) => c.toDTO()),
            voteScore: this.props.voteScore
        };
    }
}
exports.PostReadModel = PostReadModel;
