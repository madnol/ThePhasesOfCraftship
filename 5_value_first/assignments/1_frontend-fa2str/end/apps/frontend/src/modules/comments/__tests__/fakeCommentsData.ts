import { Comments } from "@dddforum/api";

export const fakeCommentsData: Comments.DTOs.CommentDTO[] = [
  {
    id: "comment-1",
    commentId: "comment-1",
    postId: "post-1",
    parentCommentId: undefined,
    text: "This is a great post!",
    member: {
      memberId: "member-1",
      userId: "user-1",
      username: "testuser1",
      reputationLevel: 'Level1',
      reputationScore: 0
    },
    createdAt: "2023-01-01T12:00:00Z",
    childComments: [],
    points: 2
  },
  {
    id: "comment-2",
    commentId: "comment-2",
    postId: "post-1",
    parentCommentId: undefined,
    text: "I agree with the previous comment",
    member: {
      memberId: "member-2",
      userId: "user-2",
      username: "testuser2",
      reputationLevel: 'Level2',
      reputationScore: 100
    },
    createdAt: "2023-01-02T12:00:00Z",
    childComments: [],
    points: 1
  }
]; 