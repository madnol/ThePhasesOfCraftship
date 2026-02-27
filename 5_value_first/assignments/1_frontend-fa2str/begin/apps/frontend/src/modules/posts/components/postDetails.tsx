import { Link } from "react-router-dom";
import moment from 'moment';
import { PostViewModel } from "../application/viewModels/postViewModel";
import { VoteToggle } from "@/shared/components/voteToggle";

interface PostDetailsProps {
  post: PostViewModel;
  onUpvote: () => void;
  onDownvote: () => void;
}


export const PostDetails = ({ post, onUpvote, onDownvote }: PostDetailsProps) => {
  return (
    <div className="post-details">
      <div className="post-item">
        <VoteToggle score={post.voteScore} onUpvote={onUpvote} onDownvote={onDownvote}/>
        <div className="post-item-content">
          <h1 className="post-item-title post-in-focus">
            {post.title}
          </h1>
          {post.link && (
            <div className="post-link-container">
              <a href={post.link} target="_blank" rel="noopener noreferrer" className="post-link">
                Click to visit the link @ {post.link}
              </a>
            </div>
            )}
          {post.content && <div className="post-content">{post.content}</div>}
          <div className="post-item-details">
            <div>{moment(post.dateCreated).fromNow()}</div>
            <Link to={`/member/${post.memberUsername}`}>
              by {post.memberUsername}
            </Link>
            <div>
              {post.numComments}{" "}
              {post.numComments !== 1 ? `comments` : "comment"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 