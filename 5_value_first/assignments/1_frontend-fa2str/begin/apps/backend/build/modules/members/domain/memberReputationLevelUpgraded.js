"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberReputationLevelUpgraded = void 0;
const src_1 = require("@dddforum/core/src");
class MemberReputationLevelUpgraded extends src_1.DomainEvent {
    constructor(props, id, retries, status, createdAt) {
        super('MemberReputationLevelUpgraded', props, props.memberId, id, retries, status, createdAt);
    }
    static create(props) {
        return new MemberReputationLevelUpgraded(props);
    }
    static toDomain(eventModel) {
        const serializedData = JSON.parse(eventModel.data);
        // Validate this data here using zod or something
        return new MemberReputationLevelUpgraded({
            memberId: serializedData.memberId,
            newLevel: serializedData.newLevel,
            newRepuationScore: serializedData.newRepuationScore
        }, eventModel.id, eventModel.retries, eventModel.status, eventModel.dateCreated.toISOString());
    }
}
exports.MemberReputationLevelUpgraded = MemberReputationLevelUpgraded;
