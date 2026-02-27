import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { PostsViewSwitcher } from "../../modules/posts/components/postsViewSwitcher";
import { PostsList } from "../../modules/posts/components/postsList";
import { usePresenters } from "../../shared/presenters/presentersContext";
import { Layout } from "@/shared/layout/layoutComponent";

export const HomePage = observer(() => {
  const { posts: presenter } = usePresenters();

  useEffect(() => {
    // Load initial data
    presenter.load();

    return () => {};
  }, [presenter]); 

  return (
    <Layout>
      <PostsViewSwitcher 
        postsView={presenter.searchFilter.value}
        onPostViewSelected={(newValue) => presenter.switchSearchFilter(newValue)}
      />
      <PostsList
        posts={presenter.postVMs}
      />
    </Layout>
  );
});
