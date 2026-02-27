// Fixtures (hvut fixtures)

import { Members } from "@dddforum/api";
import { Member } from '../../../src/modules/members/domain/member';
import { MemberUsername } from '../../../src/modules/members/domain/memberUsername'
import { CreatePost } from '../../../src/modules/posts/application/useCases/createPost/createPost';
import { PostComment } from '../../../src/modules/comments/application/useCases/postComment/postComment';

export function setupTestWithLevel2Member (useCase: CreatePost | PostComment) {
  jest.resetAllMocks();

  let level2Member = Member.toDomain({
    userId: '8be25ac7-49ff-43be-9f22-3811e268e0bd',
    username: MemberUsername.toDomain('jill-12345'),
    reputationScore: 10,
    reputationLevel: Members.Types.ReputationLevel.Level2,
    id: 'bf6b4773-feea-44cd-a951-f0ffd68625ea'
  });

  // @ts-ignore
  useCase['memberRepository'].getMemberById = jest.fn().mockResolvedValue(level2Member);

  return level2Member;
}

export function setupTestWithLevel1Member (useCase: CreatePost | PostComment) {
  const level1MemberOrError = Member.create({
    userId: '8be25ac7-49ff-43be-9f22-3811e268e0bd',
    username: 'jill1234'
  });

  expect(level1MemberOrError.isSuccess()).toBe(true);

  const member = level1MemberOrError.getValue();
    // @ts-ignore
  useCase['memberRepository'].getMemberById = jest.fn().mockResolvedValue(member);

  return member;
}