import { ReadModel } from "@dddforum/core";



interface MemberCommentVotesRoundupInput {
  memberId: string;
  allCommentsCount: number;
  upvotesCount: number;
  downvotesCount: number;
}

interface MemberCommentVotesRoundupProps {
  memberId: string;
  score: number;
  allCommentsCount: number;
  allCommentsUpvoteCount: number;
  allCommentsDownvoteCount: number;
}

export class MemberCommentVotesRoundup extends ReadModel<MemberCommentVotesRoundupProps> {
  private constructor (props: MemberCommentVotesRoundupProps) {
    super(props);
  }

  get memberId () {
    return this.props.memberId;
  }
  
  getScore () {
    return this.props.score;
  }

  public static toDomain (inputProps: MemberCommentVotesRoundupInput): MemberCommentVotesRoundup {
    const score = inputProps.upvotesCount - inputProps.downvotesCount;

    return new MemberCommentVotesRoundup({
      score,
      allCommentsCount: inputProps.allCommentsCount,
      allCommentsUpvoteCount: inputProps.upvotesCount,
      allCommentsDownvoteCount: inputProps.downvotesCount,
      memberId: inputProps.memberId
    });
  }
}
