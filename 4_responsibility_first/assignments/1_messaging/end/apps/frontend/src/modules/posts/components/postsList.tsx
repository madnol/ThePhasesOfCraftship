import { Link } from "react-router-dom";
import moment from 'moment';
import { PostViewModel } from "../application/viewModels/postViewModel";
import { VoteToggle } from "@/shared/components/voteToggle";

// Improvement - we should move these messages to view models. they should not pollute the UI layer.

export const PostsList = ({ posts }: { posts: PostViewModel[] }) => (
  <div className="posts-list">
    {posts.map((post, key) => (
      <div className="post-item" key={key}>
        <VoteToggle
            score={post.voteScore}
            canVote={false}
            onUpvote={() => {}}
            onDownvote={() => {}}
        />
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
  </div>
);
