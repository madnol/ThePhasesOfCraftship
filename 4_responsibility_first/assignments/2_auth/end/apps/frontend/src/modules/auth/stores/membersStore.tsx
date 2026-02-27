import { APIClient } from "@dddforum/api";
import { AuthStore } from "./authStore";
import { Result, success } from "@dddforum/core";
import { MemberDm } from "../domain/memberDm";
import { DTOs, Inputs } from "@dddforum/api/members";

export class MembersStore {

  constructor(
    private authStore: AuthStore,
    private apiClient: APIClient
  ) {

    this.initialize();
  }

  private async initialize () {
    const user = await this.authStore.getCurrentUser();
    if (user) {
      const memberDetails = await this.apiClient.members.getMemberDetails(user.idToken);
      if (memberDetails.success) {
        const member = MemberDm.toDomain(memberDetails.data as DTOs.MemberDTO);
        this.authStore.setMember(member);
      }
    }
  }

  async registerMember(username: string, allowMarketing: boolean): Promise<Result<MemberDm, string>> {
    try {

      const user = await this.authStore.getCurrentUser();
      if (!user || !user.email) {
        return fail('Not authenticated')
      }

      // Optionally add to marketing list
      if (allowMarketing) {
        await this.apiClient.marketing.addEmailToList(user.email);
      }

      let createMemberInput: Inputs.CreateMemberInput = {
        username,
        userId: user.id,
        email: user.email
      }

      const response = await this.apiClient.members.register(
        createMemberInput,
        user.idToken
      );

      if (response.success && response.data) {
        let memberDm = new MemberDm({
          id: response.data.memberId,
          username: response.data.username,
          email: user.email,
          userId: response.data.userId,
          reputationLevel: response.data.reputationLevel,
          reputationScore: response.data.reputationScore
        });

        this.authStore.setMember(memberDm);
        return success(memberDm)
      } else {
        return fail("Failed to register member")
      }
    } catch (error) {
      return fail("An error occurred")
    }
  }
}