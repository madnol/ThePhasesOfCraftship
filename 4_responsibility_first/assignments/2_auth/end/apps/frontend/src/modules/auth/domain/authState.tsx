import { makeAutoObservable } from "mobx";
import { MemberDm } from "./memberDm";
import { UserDm } from "./userDm";

export class AuthState {
  constructor (
    public user: UserDm | null = null,
    public member: MemberDm | null = null,
    public isLoading: boolean = false
  )  {
    makeAutoObservable(this);
  }

  hasCompletedOnboarding () {
    return this.member && this.member.id
  }
}