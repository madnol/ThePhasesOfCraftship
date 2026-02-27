"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Member = exports.MemberReputationLevel = void 0;
const src_1 = require("@dddforum/core/src");
const src_2 = require("@dddforum/errors/src");
const crypto_1 = require("crypto");
const memberReputationLevelUpgraded_1 = require("./memberReputationLevelUpgraded");
const memberUsername_1 = require("./memberUsername");
var MemberReputationLevel;
(function (MemberReputationLevel) {
    MemberReputationLevel["Level1"] = "Level 1";
    MemberReputationLevel["Level2"] = "Level 2";
    MemberReputationLevel["Level3"] = "Level 3";
})(MemberReputationLevel || (exports.MemberReputationLevel = MemberReputationLevel = {}));
class Member extends src_1.AggregateRoot {
    constructor(props) {
        super();
        this.props = props;
    }
    get id() {
        return this.props.id;
    }
    get reputationScore() {
        return this.props.reputationScore;
    }
    get username() {
        return this.props.username;
    }
    get reputationLevel() {
        return this.props.reputationLevel;
    }
    get userId() {
        return this.props.userId;
    }
    updateReputationScore(newScore) {
        this.props.reputationScore = newScore;
        if (this.reputationLevel === MemberReputationLevel.Level1 && newScore >= Member.REPUTATION_SCORE_THRESHOLD.Level1) {
            this.props.reputationLevel = MemberReputationLevel.Level2;
            const event = memberReputationLevelUpgraded_1.MemberReputationLevelUpgraded.create({ memberId: this.id, newLevel: this.reputationLevel, newRepuationScore: newScore });
            this.domainEvents.push(event);
            return;
        }
        if (this.reputationLevel === MemberReputationLevel.Level2 && newScore >= Member.REPUTATION_SCORE_THRESHOLD.Level2) {
            this.props.reputationLevel = MemberReputationLevel.Level3;
            const event = memberReputationLevelUpgraded_1.MemberReputationLevelUpgraded.create({ memberId: this.id, newLevel: this.reputationLevel, newRepuationScore: newScore });
            this.domainEvents.push(event);
            return;
        }
    }
    static create(inputProps) {
        const memberUsername = memberUsername_1.MemberUsername.create(inputProps.username);
        // Example of using value objects to validate input to create the aggregate
        if (memberUsername instanceof src_2.ApplicationErrors.ValidationError) {
            return memberUsername;
        }
        // Can also validate userId and all other properties properly using either zod, 
        // value objects, or a mixture of both, with zod encapsulated within the objects.
        return new Member(Object.assign(Object.assign({}, inputProps), { id: (0, crypto_1.randomUUID)(), reputationScore: 0, reputationLevel: MemberReputationLevel.Level1, username: memberUsername }));
    }
    static toDomain(recreationProps) {
        return new Member({
            id: recreationProps.id,
            reputationScore: recreationProps.reputationScore,
            userId: recreationProps.userId,
            username: recreationProps.username instanceof memberUsername_1.MemberUsername ? recreationProps.username : memberUsername_1.MemberUsername.toDomain(recreationProps.username),
            reputationLevel: recreationProps.reputationLevel
        });
    }
    toPersistence() {
        return {
            id: this.id,
            userId: this.props.userId,
            username: this.props.username.value,
            reputationScore: this.props.reputationScore,
            reputationLevel: this.props.reputationLevel,
        };
    }
    toDTO() {
        return {
            userId: this.props.userId,
            memberId: this.id,
            username: this.props.username.value,
            reputationLevel: this.props.reputationLevel,
            reputationScore: this.props.reputationScore,
        };
    }
}
exports.Member = Member;
Member.REPUTATION_SCORE_THRESHOLD = {
    Level1: 5,
    Level2: 10,
    Level3: Infinity
};
