import axios from "axios";
import { APIResponse, getAuthHeaders } from ".";
import { Request, Result, fail, success } from "@dddforum/core";
import { ServerErrors } from '@dddforum/errors/server'
import { Types as UserTypes } from './users'
import { ApplicationErrors } from "@dddforum/errors/application";

export namespace Types {
  export const ReputationLevel = {
    Level1: 'Level1',
    Level2: 'Level2',
    Level3: 'Level3'
  } as const;
  
  export type ReputationLevel = typeof ReputationLevel[keyof typeof ReputationLevel];
}

export namespace DTOs {
  export type MemberDTO = {
    userId: string;
    memberId: string
    username: string;
    reputationLevel: Types.ReputationLevel;
    reputationScore: number;
  }
}

export namespace Inputs {
  export type CreateMemberInput = { 
    username: string; 
    email: string; 
    userId: string;
  }
}

export namespace Commands {
  export class CreateMemberCommand {
    private constructor(public props: Inputs.CreateMemberInput) {}
  
    static fromRequest(
      decodedToken: UserTypes.DecodedIdToken | undefined, 
      body: Request['body']
    ): Result<CreateMemberCommand, ServerErrors.MissingRequestParamsError> {
      const email = decodedToken?.email || body.email;
      const userId = decodedToken?.uid || body.userId;
      const username = body.username;

      if (!email) {
        return fail(new ServerErrors.MissingRequestParamsError(["email"]));
      }
  
      if (!userId) {
        return fail(new ServerErrors.MissingRequestParamsError(["userId"]));
      }
  
      if (!username) {
        return fail(new ServerErrors.MissingRequestParamsError(["username"]));
      }
  
      return success(new CreateMemberCommand({
        userId,
        username,
        email
      }));
    }
  }
}

export namespace Errors {

  export type UsernameAlreadyTakenError = "UsernameAlreadyTaken";

  export type CreateMemberError = UsernameAlreadyTakenError;

  export type AnyMemberError = 
    CreateMemberError |
    ApplicationErrors.AnyApplicationError |
    ServerErrors.AnyServerError
}

export namespace API {
  export type CreateMemberAPIResponse = APIResponse<DTOs.MemberDTO, Errors.CreateMemberError>;

  export type GetMemberDetailsAPIResponse = APIResponse<DTOs.MemberDTO, Errors.AnyMemberError>;

  export type AnyMemberAPIResponse = CreateMemberAPIResponse;
}

export const createMembersAPI = (apiURL: string) => {
  return {
    // This is the best place to use the Result type to improve the design of your 
    // responses. Get your API to a point where it is extremely pleasing and correct to use.
    register: async (input: Inputs.CreateMemberInput, authToken: string) => {
      try {
        const successResponse = await axios.post(
          `${apiURL}/members/new`, 
          input, 
          getAuthHeaders(authToken)
        );
        return successResponse.data as API.CreateMemberAPIResponse;
      } catch (_err: unknown) {
        if (axios.isAxiosError(_err) && _err.response) {
          return _err.response.data as API.CreateMemberAPIResponse;
        }
        return {
          data: undefined,
          error: "Unknown error",
          success: false
        } as API.CreateMemberAPIResponse;
      }
    },

    getMemberDetails: async (authToken: string): Promise<API.GetMemberDetailsAPIResponse> => {
      try {
        const successResponse = await axios.get(
          `${apiURL}/members/me`,
          getAuthHeaders(authToken)
        );
        return successResponse.data as API.GetMemberDetailsAPIResponse;
      } catch (_err: unknown) {
        if (axios.isAxiosError(_err) && _err.response) {
          return _err.response.data as API.GetMemberDetailsAPIResponse;
        }
        return {
          data: undefined,
          error: "Unknown error",
          success: false
        } as API.GetMemberDetailsAPIResponse;
      }
    }
  }
}