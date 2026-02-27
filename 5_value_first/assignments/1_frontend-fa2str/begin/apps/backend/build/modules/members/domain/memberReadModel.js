"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberReadModel = void 0;
class MemberReadModel {
    constructor(props) {
        this.props = props;
    }
    get id() {
        return this.props.id;
    }
    get username() {
        return this.props.username;
    }
    get userId() {
        return this.props.userId;
    }
    get reputationLevel() {
        return this.props.reputationLevel;
    }
    get reputationScore() {
        return this.props.reputationScore;
    }
    static fromPrisma(member) {
        return new MemberReadModel({
            id: member.id,
            username: member.username,
            reputationLevel: member.reputationLevel,
            reputationScore: member.reputationScore,
            userId: member.userId
        });
    }
    // Continue to add the remaining properties when necessary
    toDTO() {
        return {
            memberId: this.props.id,
            username: this.props.username,
            userId: this.props.userId,
            reputationLevel: this.props.reputationLevel,
            reputationScore: this.props.reputationScore
        };
    }
}
exports.MemberReadModel = MemberReadModel;
