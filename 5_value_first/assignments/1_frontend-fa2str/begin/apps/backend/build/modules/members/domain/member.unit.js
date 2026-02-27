"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const member_1 = require("./member");
describe('member', () => {
    test('a new member should start out at level 1 reputation level', () => {
        let member = member_1.Member.create({
            userId: '8be25ac7-49ff-43be-9f22-3811e268e0bd',
            username: 'billy',
        });
        expect(member.reputationLevel).toEqual(member_1.MemberReputationLevel.Level1);
    });
});
