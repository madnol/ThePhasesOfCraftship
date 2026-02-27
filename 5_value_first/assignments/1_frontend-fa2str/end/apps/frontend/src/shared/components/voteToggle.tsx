
import arrow from '../assets/arrow.svg';

interface VoteToggleProps {
  score: number;
  canVote: boolean;
  onUpvote: () => void;
  onDownvote: () => void;
}

export const VoteToggle = (props: VoteToggleProps) => (
  <div className="post-item-votes">
    <div 
      className={`post-item-upvote ${props.canVote ? 'cursor-pointer' : ''}`}
      data-tooltip-id="upvote-tooltip"
      data-tooltip-content={props.canVote ? undefined : "Voting unlocked at level 2"}
      onClick={() => props.canVote && props.onUpvote()}
    >
      <img src={arrow} />
    </div>
    <div>{props.score}</div>
    <div 
      className={`post-item-downvote ${props.canVote ? 'cursor-pointer' : ''}`}
      data-tooltip-id="downvote-tooltip"
      data-tooltip-content={props.canVote ? undefined : "Voting unlocked at level 2"}
      onClick={() => props.canVote && props.onDownvote()}
    >
      <img src={arrow} />
    </div>
  </div>
)
