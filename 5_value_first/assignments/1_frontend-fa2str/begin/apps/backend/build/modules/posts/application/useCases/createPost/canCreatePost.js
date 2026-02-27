"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CanCreatePostPolicy = void 0;
const member_1 = require("../../../../members/domain/member");
class CanCreatePostPolicy {
    static isAllowed(member) {
        if (member.reputationLevel === member_1.MemberReputationLevel.Level2) {
            return true;
        }
        return false;
    }
}
exports.CanCreatePostPolicy = CanCreatePostPolicy;
