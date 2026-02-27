import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { LayoutContainer } from "@/shared/layout/layoutContainer";

export const PostPage = observer(() => {

  return (
    <LayoutContainer>
      <Link to="/">Back to all discussions</Link>
      <div className="content-container">
        Not yet implemented
      </div>
    </LayoutContainer>
  );
});