import { makeAutoObservable } from "mobx";

import { APIClient } from "@dddforum/api";
import { UserDm } from "../domain/userDm";
import { AuthState } from "../domain/authState";
import { FirebaseAPI } from "../infra/firebase/firebaseAPI";
import { MemberDm } from "../domain/memberDm";

export class AuthStore {
  public authState = new AuthState();

  constructor(
    public apiClient: APIClient,
    private firebaseAPI: FirebaseAPI
  ) {
    makeAutoObservable(this);
    this.initialize();
  }

  private async initialize() {
    await this.getCurrentUser();
  }

  async getCurrentUser () {
    this.authState.isLoading = true;
    if (this.authState.user) return this.authState.user;
    let authenticatedUser = await this.firebaseAPI.waitForAuthenticatedUser();
    this.authState.isLoading = false;

    if (authenticatedUser) {
      this.authState.user = authenticatedUser;
    }

    return this.authState.user;
  }

  async getCurrentMember () {
    return this.authState.member;
  }

  setUser (userDm: UserDm) {
    this.authState.user = userDm;
  }

  setMember (memberDm: MemberDm) {
    this.authState.member = memberDm;
  }

  public isAuthenticated(): boolean {
    return !!this.authState.user
  }

  async logout(): Promise<void> {
    // Clear all state by updating properties
    this.authState.user = null;
    this.authState.member = null;
  }
} 