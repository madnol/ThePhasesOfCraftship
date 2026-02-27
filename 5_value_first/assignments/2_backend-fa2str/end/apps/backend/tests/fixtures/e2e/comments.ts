import { createAPIClient } from "@dddforum/api";
import { createFakeAuthTokenAndUser } from "./users";
import { setupLevel1Member } from "./members";

export async function setupComment(apiClient: ReturnType<typeof createAPIClient>) {
  const { token, userId } = await createFakeAuthTokenAndUser();
  const { member } = await setupLevel1Member(apiClient, token, userId);

  // get all posts
  const postsResponse = await apiClient.posts.getPosts({
    sort: 'recent'
  });
  if (!postsResponse.success || !postsResponse.data) {
    throw new Error('Failed to get posts');
  }
  
  // Find a post to comment on
  const postToCommentOn = postsResponse.data[0];
  if (!postToCommentOn) {
    throw new Error('No posts found to comment on');
  }

  const commentResponse = await apiClient.comments.postComment({
    postId: postToCommentOn.id,
    memberId: member.memberId,
    text: 'Test comment'
  }, token);

  if (!commentResponse.success || !commentResponse.data) {
    throw new Error('Failed to post comment');
  }

  console.log('comment', commentResponse.data)

  await new Promise(resolve => setTimeout(resolve, 3000));

  return {
    comment: commentResponse.data,
    member,
    post: postToCommentOn
  };
}