
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
      className={`post-item-upvote`}
      onClick={() => {}}
    >
      <img src={arrow} />
    </div>
    <div>{props.score}</div>
    <div 
      className={`post-item-downvote`}
      onClick={() => {}}
    >
      <img src={arrow} />
    </div>
  </div>
)
