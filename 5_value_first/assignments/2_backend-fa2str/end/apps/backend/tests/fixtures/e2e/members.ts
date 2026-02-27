import { NumberUtil } from "@dddforum/core";
import { APIClient, Members } from "@dddforum/api";
import { DatabaseFixture } from "./database";

export async function setupLevel1Member(
  apiClient: APIClient,
  authToken: string,
  userId: string
) {
  const username = `khalilstemmler-${NumberUtil.generateRandomInteger(10000, 99999)}`;
  const email = `${username}@test.com`;

  const response = await apiClient.members.register({
    username,
    email,
    userId
  }, authToken);

  if (!response.success) {
    throw new Error(`Failed to create member: ${response.error}`);
  }

  expect(response.data).toBeDefined();
  expect(response.data?.memberId).toBeDefined();
  expect(response.data?.userId).toBeDefined();
  expect(response.data?.username).toBeDefined();

  console.log(`Created a Level 1 member`);
  console.log(response)

  return { member: response.data as Members.DTOs.MemberDTO };
}

export async function setupLevel2Member (
  apiClient: APIClient,
  authToken: string,
  userId: string,
  databaseFixture: DatabaseFixture
) {
  let { member } = await setupLevel1Member(apiClient, authToken, userId);

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

  // post a comment to the post x5 times
  for (let i = 0; i < 5; i++) {
    const commentResponse = await apiClient.comments.postComment({
      postId: postToCommentOn.id,
      memberId: member.memberId,
      text: `Test comment ${i + 1}`
    }, authToken);
    console.log(commentResponse);
    if (!commentResponse.success) {
      throw new Error('Failed to post comment');
    }
  }

  // verify that the member is now level 2 by checking the database via the fixture
  const updatedMember = await databaseFixture.getMemberById(member.memberId);
  if (!updatedMember) {
    throw new Error('Failed to verify member level');
  }

  // Wait for 3 seconds before checking the reputation level
  await new Promise(resolve => setTimeout(resolve, 3000));

  return { member }; 
}

export async function setupLevel3Member (
  apiClient: APIClient,
  authToken: string,
  userId: string,
  databaseFixture: DatabaseFixture,
  targetMemberReputationScore: number
) {

  if (targetMemberReputationScore < 10) {
    throw new Error('To create a level 3 member, the target reputation score must be at least 10')
  }

  let { member } = await setupLevel1Member(apiClient, authToken, userId);

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

  // post a comment to the post at last 10 time
  for (let i = 0; i < targetMemberReputationScore; i++) {
    const commentResponse = await apiClient.comments.postComment({
      postId: postToCommentOn.id,
      memberId: member.memberId,
      text: `Test comment ${i + 1}`
    }, authToken);
    console.log(commentResponse);
    if (!commentResponse.success) {
      throw new Error('Failed to post comment');
    }
  }

  // Wait for 10 seconds before checking the reputation level
  await new Promise(resolve => setTimeout(resolve, 10000));

  // verify that the member is now level 3 by checking the database via the fixture
  const updatedMember = await databaseFixture.getMemberById(member.memberId);
  if (!updatedMember) {
    throw new Error('Failed to verify member level');
  }

  expect (updatedMember.reputationLevel === 'Level3').toBeTruthy();

  return { member: updatedMember }; 
}