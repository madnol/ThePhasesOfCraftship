"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentReadModel = void 0;
class CommentReadModel {
    constructor(props) {
        this.props = props;
    }
    static fromPrismaToDomain(commentModel, member) {
        return new CommentReadModel({
            id: commentModel.id,
            text: commentModel.text,
            dateCreated: commentModel.dateCreated.toISOString(),
            member: member
        });
    }
    toDTO() {
        return {
            id: this.props.id,
            text: this.props.text,
            dateCreated: this.props.dateCreated,
            member: {
                memberId: this.props.member.id,
                username: this.props.member.username,
                userId: this.props.member.userId,
                reputationLevel: this.props.member.reputationLevel,
                reputationScore: this.props.member.reputationScore
            }
        };
    }
}
exports.CommentReadModel = CommentReadModel;
