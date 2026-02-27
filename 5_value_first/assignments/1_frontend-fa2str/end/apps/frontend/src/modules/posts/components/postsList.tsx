import { Link } from "react-router-dom";
import arrow from "../../../shared/assets/arrow.svg";
import moment from 'moment';
import { Tooltip } from 'react-tooltip';
import { PostViewModel } from "../application/viewModels/postViewModel";

// Improvement - we should move these messages to view models. they should not pollute the UI layer.

export const PostsList = ({ posts }: { posts: PostViewModel[] }) => (
  <div className="posts-list">
    {posts.map((post, key) => (
      <div className="post-item" key={key}>
        <div className="post-item-votes">
          <div 
            className={`post-item-upvote ${post.canCastVote ? 'cursor-pointer' : ''}`}
            data-tooltip-id="upvote-tooltip"
            data-tooltip-content={post.canCastVote ? undefined : "Voting unlocked at level 2"}
          >
            <img src={arrow} />
          </div>
          <div>{post.voteScore}</div>
          <div 
            className={`post-item-downvote ${post.canCastVote ? 'cursor-pointer' : ''}`}
            data-tooltip-id="downvote-tooltip"
            data-tooltip-content={post.canCastVote ? undefined : "Voting unlocked at level 2"}
          >
            <img src={arrow} />
          </div>
        </div>
        <div className="post-item-content">
          <Link to={`/posts/${post.slug}`} className="post-item-title">
            {post.title}
          </Link>
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
    ))}
    <Tooltip 
      id="upvote-tooltip" 
      place="right"
      delayShow={200}
      delayHide={200}
    />
    <Tooltip 
      id="downvote-tooltip" 
      place="right"
      delayShow={200}
      delayHide={200}
    />
  </div>
);
