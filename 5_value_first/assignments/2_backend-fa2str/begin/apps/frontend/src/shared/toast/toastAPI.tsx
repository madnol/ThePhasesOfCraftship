import { toast } from "react-toastify";

export interface IToastAPI {
  showError (message: string): void;
  showSuccess (message: string): void;
}

export class ToastAPI implements IToastAPI {
  showError (message: string) {
    return toast.error(message, {
      toastId: `failure-toast`
    });
  }

  showSuccess (message: string) {
    return toast.success(message, {
      toastId: `success-toast`
    });
  }
}
