import { observer } from "mobx-react-lite";
import { CommentViewModel } from "../application/viewModels/commentViewModel";
import moment from "moment";
import { VoteToggle } from "@/shared/components/voteToggle";

interface CommentsListProps {
  comments: CommentViewModel[];
  onUpvote: () => void;
  onDownvote: () => void;
}

interface CommentProps {
  comment: CommentViewModel;
  onUpvote: () => void;
  onDownvote: () => void;
}

const Comment = ({ comment, onUpvote, onDownvote }: CommentProps) => (
  <div className="comment-item flex gap-4">
    <VoteToggle 
      score={comment.points}
      canVote={comment.canVoteOnComment}
      onUpvote={onUpvote}
      onDownvote={onDownvote}
    />
    <div className="comment-content">
      <div className="comment-metadata">
        <span>by {comment.memberUsername}</span>
        <span> | </span>
        <span>{moment(comment.dateCreated).fromNow()}</span>
      </div>
      <div className="comment-text">{comment.text}</div>
      <span style={{ cursor: 'pointer'}} onClick={() => alert('Not yet implemented - feel free to :)')}><u>Reply</u></span>
    </div>
    
    {comment.childComments.length > 0 && (
        <div className="comment-replies">
          {comment.childComments.map((child) => (
            <Comment key={child.id} comment={child} onDownvote={onDownvote} onUpvote={onUpvote}  />
          ))}
        </div>
      )}
  </div>
);

export const CommentsList = observer(({ comments, onDownvote, onUpvote }: CommentsListProps) => {
  if (!comments.length) {
    return <div className="comments-empty">No comments yet</div>;
  }

  return (
    <div className="comments-list">
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} onDownvote={onDownvote} onUpvote={onUpvote} />
      ))}
    </div>
  );
});
