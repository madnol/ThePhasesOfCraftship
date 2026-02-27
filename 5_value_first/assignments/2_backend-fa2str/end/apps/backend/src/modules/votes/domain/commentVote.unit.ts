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
      const voteOrError = CommentVote.create(memberId, commentId);
      if (voteOrError instanceof ApplicationErrors.ValidationError) {
        throw new Error('Should not return validation error');
      }
      
      expect(voteOrError).toBeInstanceOf(CommentVote);
      expect(voteOrError.voteState).toBe('Default');
      expect(voteOrError.getValue()).toBe(0);
    });
  });

  describe('voting', () => {
    it('should upvote a default vote', () => {
      const voteOrError = CommentVote.create(memberId, commentId);
      if (voteOrError instanceof ApplicationErrors.ValidationError) {
        throw new Error('Should not return validation error');
      }
      
      const member = createTestMember();
      voteOrError.castVote('upvote', member);
      
      expect(voteOrError.voteState).toBe('Upvoted');
      expect(voteOrError.getValue()).toBe(1);
      expect(voteOrError.getDomainEvents()).toHaveLength(1);
    });

    it('should downvote a default vote', () => {
      const voteOrError = CommentVote.create(memberId, commentId);
      if (voteOrError instanceof ApplicationErrors.ValidationError) {
        throw new Error('Should not return validation error');
      }
      
      const member = createTestMember();
      voteOrError.castVote('downvote', member);
      
      expect(voteOrError.voteState).toBe('Downvoted');
      expect(voteOrError.getValue()).toBe(-1);
      expect(voteOrError.getDomainEvents()).toHaveLength(1);
    });

    it('should not change state when upvoting an already upvoted comment', () => {
      const voteOrError = CommentVote.create(memberId, commentId);
      if (voteOrError instanceof ApplicationErrors.ValidationError) {
        throw new Error('Should not return validation error');
      }
      
      const member = createTestMember();
      // First upvote
      voteOrError.castVote('upvote', member);
      
      // Try to upvote again
      voteOrError.castVote('upvote', member);
      
      expect(voteOrError.voteState).toBe('Upvoted');
      expect(voteOrError.getValue()).toBe(1);
      expect(voteOrError.getDomainEvents()).toHaveLength(1); // Only one event from the first upvote
    });

    it('should not change state when downvoting an already downvoted comment', () => {
      const voteOrError = CommentVote.create(memberId, commentId);
      if (voteOrError instanceof ApplicationErrors.ValidationError) {
        throw new Error('Should not return validation error');
      }
      
      const member = createTestMember();
      // First downvote
      voteOrError.castVote('downvote', member);
      
      // Try to downvote again
      voteOrError.castVote('downvote', member);
      
      expect(voteOrError.voteState).toBe('Downvoted');
      expect(voteOrError.getValue()).toBe(-1);
      expect(voteOrError.getDomainEvents()).toHaveLength(1); // Only one event from the first downvote
    });
  });

  describe('super voting', () => {
    it ('should have a vote value of 1 for a level 11 reputation level member', () => {
      const member = createTestMember(11, 'Level3')
      const voteOrError = CommentVote.create(memberId, commentId);
        if (voteOrError instanceof ApplicationErrors.ValidationError) {
          throw new Error('Should not return validation error');
        }
        
        voteOrError.castVote('upvote', member);
        
        expect(voteOrError.voteState).toBe('Upvoted');
        expect(voteOrError.getValue()).toBe(1);
        expect(voteOrError.getDomainEvents()).toHaveLength(1);
    })

    it ('should have a vote value of 1 for a level 14 reputation level member', () => {
      const member = createTestMember(14, 'Level3')
      const voteOrError = CommentVote.create(memberId, commentId);
        if (voteOrError instanceof ApplicationErrors.ValidationError) {
          throw new Error('Should not return validation error');
        }
        
        voteOrError.castVote('upvote', member);
        
        expect(voteOrError.voteState).toBe('Upvoted');
        expect(voteOrError.getValue()).toBe(1);
        expect(voteOrError.getDomainEvents()).toHaveLength(1);
    })

    it ('should have a vote value of 2 for a level 16 reputation level member', () => {
      const member = createTestMember(16, 'Level3')
      const voteOrError = CommentVote.create(memberId, commentId);
        if (voteOrError instanceof ApplicationErrors.ValidationError) {
          throw new Error('Should not return validation error');
        }
        
        voteOrError.castVote('upvote', member);
        
        expect(voteOrError.voteState).toBe('Upvoted');
        expect(voteOrError.getValue()).toBe(2);
        expect(voteOrError.getDomainEvents()).toHaveLength(1);
    })

    it ('should have a vote value of 2 for a level 22 reputation level member', () => {
      const member = createTestMember(22, 'Level3')
      const voteOrError = CommentVote.create(memberId, commentId);
        if (voteOrError instanceof ApplicationErrors.ValidationError) {
          throw new Error('Should not return validation error');
        }
        
        voteOrError.castVote('upvote', member);
        
        expect(voteOrError.voteState).toBe('Upvoted');
        expect(voteOrError.getValue()).toBe(2);
        expect(voteOrError.getDomainEvents()).toHaveLength(1);
    })

    it ('should have a vote value of 3 for a level 26 reputation level member', () => {
      const member = createTestMember(26, 'Level3')
      const voteOrError = CommentVote.create(memberId, commentId);
        if (voteOrError instanceof ApplicationErrors.ValidationError) {
          throw new Error('Should not return validation error');
        }
        
        voteOrError.castVote('upvote', member);
        
        expect(voteOrError.voteState).toBe('Upvoted');
        expect(voteOrError.getValue()).toBe(3);
        expect(voteOrError.getDomainEvents()).toHaveLength(1);
    })
  })
});