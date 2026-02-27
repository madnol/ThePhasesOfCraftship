import { makeAutoObservable } from "mobx";

export class RegistrationVm {
  constructor(
    public isSubmitting: boolean = false
  ) {
    makeAutoObservable(this);
  }
}