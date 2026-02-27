import { CommentVote } from "../domain/commentVote";
import { ApplicationErrors } from "@dddforum/errors/application";
import { Member } from "../../members/domain/member";
import { MemberUsername } from "../../members/domain/memberUsername";
import { Types as MemberTypes } from "@dddforum/api/members";

describe('commentVote', () => {
  const memberId = 'member-1';
  const commentId = 'comment-1';

  const createTestMember = (reputationScore: number = 3, level: MemberTypes.ReputationLevel = 'Level1') => {
    return Member.toDomain({
      id: memberId,
      userId: 'user-1',
      username: MemberUsername.toDomain('testuser'),
      reputationScore,
      reputationLevel: level
    });
  };

  describe('creation', () => {
    it('should create a default vote', () => {

    });
  });

  describe('voting', () => {
    it('should upvote a default vote', () => {

    });

    it('should downvote a default vote', () => {

    });

    it('should not change state when upvoting an already upvoted comment', () => {

    });

    it('should not change state when downvoting an already downvoted comment', () => {

    });
  });

  describe('super voting', () => {
    it ('should have a vote value of 1 for a level 11 reputation level member', () => {

    })

    it ('should have a vote value of 1 for a level 14 reputation level member', () => {

    })

    it ('should have a vote value of 2 for a level 16 reputation level member', () => {

    })

    it ('should have a vote value of 2 for a level 22 reputation level member', () => {

    })

    it ('should have a vote value of 3 for a level 26 reputation level member', () => {

    })
  })
});