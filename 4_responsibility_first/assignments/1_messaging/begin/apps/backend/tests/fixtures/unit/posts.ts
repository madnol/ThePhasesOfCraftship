import { PostComment } from "../../../src/modules/comments/application/useCases/postComment/postComment";
import { Post } from "../../../src/modules/posts/domain/post";

export function withExistingPostByRandomMember (useCase: PostComment) {
  const existingPost = Post.create({
    memberId: '8be25ac7-49ff-43be-9f22-3811e268e0bd',
    title: 'Test Post',
    postType: 'text',
    content: 'This is a test post'
  });

  expect(existingPost instanceof Post).toBe(true);

  useCase['postRepository'].getPostById = jest.fn().mockResolvedValue(existingPost as Post);

  return existingPost as Post;
}