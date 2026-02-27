
import { CommentDm } from '../domain/commentDm';

export interface CommentsRepository {
  comments: CommentDm[];
  getCommentsByPostId(postId: string): Promise<CommentDm[]>;
} 
