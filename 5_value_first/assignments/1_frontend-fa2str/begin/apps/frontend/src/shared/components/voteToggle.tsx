
import arrow from '../assets/arrow.svg';

interface VoteToggleProps {
  score: number;
  onUpvote: () => void;
  onDownvote: () => void;
}

export const VoteToggle = (props: VoteToggleProps) => (
  <div className="post-item-votes">
    <div 
      className={`post-item-upvote cursor-pointer`}
      onClick={() => {}}
    >
      <img src={arrow} />
    </div>
    <div>{props.score}</div>
    <div 
      className={`post-item-downvote cursor-pointer`}
      onClick={() => {}}
    >
      <img src={arrow} />
    </div>
  </div>
)
