import { makeAutoObservable } from "mobx";

import { APIClient, Users } from "@dddforum/api";
import { UserDm } from "../domain/userDm";
import { MemberDm } from "../domain/memberDm";
import { AuthState } from "../domain/authState";

export class AuthStore {
  public authState = new AuthState()

  constructor(
    public apiClient: APIClient,
  ) {
    makeAutoObservable(this);
    this.initialize();
  }

  private async initialize() {

  }

  public getToken () {
    // Temporary for Pattern-First
    return 'temp';
  }

  getCurrentUser () {
    return this.authState.user;
  }

  getCurrentMember () {
    return this.authState.member;
  }

  public async register (
    input: Users.Inputs.CreateUserInput, 
    allowMarketingEmails: boolean
  ): Promise<Users.API.CreateUserResponse> {
    // Implement
    throw new Error('Not yet implemented')
  }

  private setupInitialUserAndMember (userDTO: Users.DTOs.UserDTO) {
    this.authState.user = UserDm.fromDTO(userDTO);
    this.authState.member = MemberDm.fromInitialUser(this.authState.user)
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