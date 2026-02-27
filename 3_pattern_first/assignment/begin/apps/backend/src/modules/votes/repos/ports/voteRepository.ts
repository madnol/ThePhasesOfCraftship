
import { CommentVote } from "../../domain/commentVote";
import { MemberCommentVotesRoundup } from "../../domain/memberCommentVotesRoundup";
import { MemberPostVotesRoundup } from "../../domain/memberPostVotesRoundup";
import { PostVote } from "../../domain/postVote";

export interface VoteRepository {
  findVoteByMemberAndPostId (memberId: string, postId: string): Promise<PostVote | null>;
  findVoteByMemberAndCommentId (memberId: string, commentId: string): Promise<CommentVote | null>;
  // Always keep in mind the extremes. What if a member's comment has 1000 comments? 
  // That's why we use a roundup.
  getMemberCommentVotesRoundup(memberId: string): Promise<MemberCommentVotesRoundup>;
  getMemberPostVotesRoundup(memberId: string): Promise<MemberPostVotesRoundup>;
  save (postOrCommentVote: CommentVote | PostVote): Promise<void>;
}
