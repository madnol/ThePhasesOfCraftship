
import { Inputs as PostInputs } from '@dddforum/api/posts'
import { APIClient, Members, Posts } from "@dddforum/api";


export async function setupPost (apiClient: APIClient, member: Members.DTOs.MemberDTO, authToken: string) {
  let postData: PostInputs.CreatePostInput = {
    memberId: member.memberId,
    title: 'A new post',
    postType: "text",
    content: 'This is a new text post that I am creating!'
  };
  let response = await apiClient.posts.create(postData, authToken);

  expect(response).toBeDefined();
  expect(response.success).toBe(true);
  return { post: response.data as Posts.DTOs.PostDTO };
}

