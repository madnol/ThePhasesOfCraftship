
import { VoteRepository } from "../ports/voteRepository";
import { MemberCommentVotesRoundup } from "../../domain/memberCommentVotesRoundup";
import { MemberPostVotesRoundup } from "../../domain/memberPostVotesRoundup";
import { Database, Prisma } from "@dddforum/database";
import { CommentVote } from "../../domain/commentVote";
import { PostVote } from "../../domain/postVote";

export class ProductionVotesRepository implements VoteRepository {
  constructor (private database: Database) {
  }

  async getMemberCommentVotesRoundup(memberId: string): Promise<MemberCommentVotesRoundup> {
    const connection = this.database.getConnection();
    const [allCommentsCount, upvotesCount, downvotesCount] = await Promise.all([
      connection.commentVote.count({
        where: { memberId },
      }),
      connection.commentVote.count({
        where: { 
          commentBelongsTo: {
            memberId,
          },
          value: 1
        },
      }),
      connection.commentVote.count({
        where: { 
          commentBelongsTo: {
            memberId,
          },
          value: -1
        },
      })
    ])

    const roundup = MemberCommentVotesRoundup.toDomain({
      memberId, allCommentsCount, upvotesCount, downvotesCount
    });

    return roundup;
  }

  async getMemberPostVotesRoundup(memberId: string): Promise<MemberPostVotesRoundup> {
    try {
      const connection = this.database.getConnection();
      const [allPostsCount, upvotesCount, downvotesCount] = await Promise.all([
        connection.postVote.count({
          where: { 
            postBelongsTo: {
              memberId
            }
          },
        }),
        connection.postVote.count({
          where: { 
            postBelongsTo: {
              memberId
            },
            value: 1
          },
        }),
        connection.postVote.count({
          where: { 
            postBelongsTo: {
              memberId
            },
            value: -1
          },
        })
      ])
  
      const roundup = MemberPostVotesRoundup.toDomain({
        memberId, allPostsCount, upvotesCount, downvotesCount
      });
  
      return roundup;
    } catch (err) {
      console.log(err);
      throw new Error('Error getting member post votes roundup');
      
    }
  }
  
  async findVoteByMemberAndCommentId(memberId: string, commentId: string): Promise<CommentVote | null> {
    const connection = this.database.getConnection();
    const vote = await connection.commentVote.findUnique({
      where: {
        memberId_commentId: {
          memberId,
          commentId
        }
      }
    });

    if (!vote) return null;

    return CommentVote.toDomain({
      id: vote.id,
      memberId: vote.memberId,
      commentId: vote.commentId,
      voteState: vote.value === 1 ? 'Upvoted' : vote.value === -1 ? 'Downvoted' : 'Default'
    });
  }

  async findVoteByMemberAndPostId(memberId: string, postId: string): Promise<PostVote | null> {
    const connection = this.database.getConnection();
    const vote = await connection.postVote.findUnique({
      where: {
        memberId_postId: {
          memberId,
          postId
        }
      }
    });

    if (!vote) return null;

    return PostVote.toDomain({
      id: vote.id,
      memberId: vote.memberId,
      postId: vote.postId,
      voteState: vote.value === 1 ? 'Upvoted' : vote.value === -1 ? 'Downvoted' : 'Default'
    });
  }

  async save(vote: PostVote | CommentVote, transaction?: Prisma.TransactionClient) {
    // implement
    throw new Error("Not yet implemented")
  }
}
