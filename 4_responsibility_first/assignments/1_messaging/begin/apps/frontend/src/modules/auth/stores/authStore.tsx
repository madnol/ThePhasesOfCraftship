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
    
    if (allowMarketingEmails) {
      await this.apiClient.marketing.addEmailToList(input.email);
    }
    
    this.authState.isLoading = true;

    /**
     * We are temporarily still using the old users API for Pattern-First. We will explore how to implement
     * auth properly in RDD-First.
     */

    let registrationResult = await this.apiClient.users.register(input);
    this.authState.isLoading = false;

    if (!registrationResult.success) {
      // If failure, then we don't get to set the details
      return registrationResult;
    }

    // If it's a success, then we can cache the user to the store
    const userDTO = registrationResult.data as Users.DTOs.UserDTO;
    this.setupInitialUserAndMember(userDTO);

    // And then signal a success
    return registrationResult
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