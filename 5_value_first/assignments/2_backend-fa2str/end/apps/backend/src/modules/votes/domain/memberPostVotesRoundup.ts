
import { ReadModel } from "@dddforum/core";

interface MemberPostVotesRoundupInput {
  memberId: string;
  allPostsCount: number;
  upvotesCount: number;
  downvotesCount: number
}

interface MemberPostVotesRoundupProps {
  memberId: string;
  score: number;
  allPostsCount: number;
  allPostsUpvoteCount: number;
  allPostsDownvoteCount: number;
}

export class MemberPostVotesRoundup extends ReadModel<MemberPostVotesRoundupProps> {
  private constructor (props: MemberPostVotesRoundupProps) {
    super(props);
  }

  get memberId () {
    return this.props.memberId;
  }

  getScore () {
    return this.props.score;
  }

  public static toDomain (inputProps: MemberPostVotesRoundupInput): MemberPostVotesRoundup {

    const score = inputProps.upvotesCount - inputProps.downvotesCount;

    return new MemberPostVotesRoundup({
      score,
      allPostsCount: inputProps.allPostsCount,
      allPostsUpvoteCount: inputProps.upvotesCount,
      allPostsDownvoteCount: inputProps.downvotesCount,
      memberId: inputProps.memberId
    });
  }
}
