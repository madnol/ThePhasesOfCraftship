import { Member } from "./member"
import { Types } from '@dddforum/api/members'

describe('member', () => {
  test('a new member should start out at level 1 reputation level', () => {
    const result = Member.create({
      userId: '8be25ac7-49ff-43be-9f22-3811e268e0bd',
      username: 'billy',
    });

    expect(result.isSuccess()).toBe(true);
    const member = result.getValue();
    expect(member.reputationLevel).toEqual(Types.ReputationLevel.Level1)
  })
})
