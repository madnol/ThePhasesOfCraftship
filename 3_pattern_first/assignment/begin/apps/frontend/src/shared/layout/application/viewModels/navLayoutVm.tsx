

import { MemberDm } from "@/modules/auth/domain/memberDm";
import { UserDm } from "@/modules/auth/domain/userDm";
import { makeAutoObservable } from "mobx";

interface NavLayoutVmProps {
  isAuthenticated: boolean;
  username: string | null;
  pathname: string;
}

export class NavLayoutVm {

  private props: NavLayoutVmProps

  constructor(props: NavLayoutVmProps) {
    makeAutoObservable(this)
    this.props = props;
  }

  get isAuthenticated () {
    return this.props.isAuthenticated
  }

  get username () {
    return this.props.username;
  }

  get pathname () {
    return this.props.pathname
  }

  public static fromDomain (
    user: UserDm | null, 
    member: MemberDm | null, 
    pathname: string
  ): NavLayoutVm {

    const vm = new NavLayoutVm({
      isAuthenticated: user ? true : false,
      username: member ? member.username : null,
      pathname
    });

    return vm;
  }
}
