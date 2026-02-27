import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { usePresenters } from "@/shared/presenters/presentersContext";
import { Layout } from "@/shared/layout/layoutComponent";
import { OverlaySpinner } from "@/shared/spinner/overlaySpinner";
import { PostDetails } from "@/modules/posts/components/postDetails";
import { CommentsList } from "@/modules/comments/components/commentsList";

export const PostPage = observer(() => {
  const { postDetails: postDetailsPresenter, comments: commentsPresenter } = usePresenters();
  const { slug } = useParams();
  
  useEffect(() => {
    if (slug) {
      postDetailsPresenter.loadPost(slug);
    }
  }, [slug]);

  useEffect(() => {
    if (postDetailsPresenter.post) {
      commentsPresenter.loadComments(postDetailsPresenter.post.id);
    }
  }, [postDetailsPresenter.post]);

  const handleUpvotePost = () => {
    if (postDetailsPresenter.post) {
      postDetailsPresenter.upvotePost();
    }
  };

  const handleDownvotePost = () => {
    if (postDetailsPresenter.post) {
      postDetailsPresenter.downvotePost();
    }
  };

  const handleUpvoteComment = () => {
    commentsPresenter.upvoteComment();
  };

  const handleDownvoteComment = () => {
    commentsPresenter.downvoteComment();
  };

  if (postDetailsPresenter.isLoading) {
    return <OverlaySpinner isActive={true} />;
  }

  const post = postDetailsPresenter.post;
  if (!post) {
    return (
      <Layout>
        <div className="content-container">
          <div>Post not found</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Link to="/">Back to all discussions</Link>
      <div className="content-container">
        <PostDetails 
          post={post} 
          onUpvote={handleUpvotePost}
          onDownvote={handleDownvotePost}
        />
        {/** comment submission form */}
        <CommentsList 
          comments={commentsPresenter.comments} 
          onUpvote={handleUpvoteComment}
          onDownvote={handleDownvoteComment}
        />
      </div>
    </Layout>
  );
});