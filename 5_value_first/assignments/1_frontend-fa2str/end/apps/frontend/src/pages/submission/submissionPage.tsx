import { observer } from "mobx-react-lite";
import { usePresenters } from "../../shared/presenters/presentersContext";
import { SubmissionForm } from "../../modules/posts/components/submissionForm";
import { Layout } from "@/shared/layout/layoutComponent";
import { useEffect, useState } from "react";
import { SubmissionViewModel } from "@/modules/posts/application/viewModels/submissionViewModel";

export const SubmissionPage = observer(() => {
  const [loadedVm, setLoadedVm] = useState<SubmissionViewModel>(new SubmissionViewModel());
  const { submission: presenter } = usePresenters();

  useEffect(() => {
    presenter.load((vm) => {
      setLoadedVm(vm);
    })
  }, []);

  const handleSubmit = (data: { title: string; content: string; link?: string }) => {
    presenter.submit(data);
  };

  return (
    <Layout>
      <div className="content-container">
        <SubmissionForm 
          onSubmit={handleSubmit}
          isSubmitting={loadedVm.isSubmitting}
          error={loadedVm.error}
          canPost={loadedVm.canPost}
          disabledMessage={loadedVm.disabledMessage}
        />
      </div>
    </Layout>
  );
}); 