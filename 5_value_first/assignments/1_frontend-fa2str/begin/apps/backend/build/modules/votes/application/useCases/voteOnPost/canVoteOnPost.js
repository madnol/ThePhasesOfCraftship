"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CanVoteOnPostPolicy = void 0;
const member_1 = require("../../../../members/domain/member");
class CanVoteOnPostPolicy {
    static isAllowed(member) {
        if (member.reputationLevel === member_1.MemberReputationLevel.Level1 ||
            member.reputationLevel === member_1.MemberReputationLevel.Level2) {
            return true;
        }
        return false;
    }
}
exports.CanVoteOnPostPolicy = CanVoteOnPostPolicy;
