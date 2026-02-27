import axios from "axios";
import { APIResponse } from ".";
import { ServerErrors } from "@dddforum/errors/server";
import { ApplicationErrors } from "@dddforum/errors/application";
import { Result, TextUtil, fail, success } from "@dddforum/core"

export namespace Types {
  export type DecodedIdToken = {
    email: string;
    uid: string;
  }
}

export type ValidatedUser = {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
}

export namespace Errors {
  export type CreateUserErrors =
    | ApplicationErrors.ConflictError // username, email
    | ApplicationErrors.ValidationError
    | ServerErrors.AnyServerError
}

export namespace API {
  export type CreateUserResponse = APIResponse<DTOs.UserDTO, Errors.CreateUserErrors>;
}

export type UserNotFoundError = "UserNotFound";
export type GetUserByEmailErrors =  
  | UserNotFoundError;

export type GetUserByEmailResponse = APIResponse<DTOs.UserDTO, GetUserByEmailErrors>;
export type GetUserErrors = GetUserByEmailErrors

export type UserResponse = APIResponse<
  API.CreateUserResponse | 
  GetUserByEmailResponse | null,
  GetUserErrors |
  ServerErrors.AnyServerError |
  ApplicationErrors.AnyApplicationError
>;

export namespace DTOs {
  export type UserDTO = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    username: string;
  };
}

export namespace Inputs {
  export type CreateUserInput = {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
  };  
}

export namespace Commands {
  export class CreateUserCommand {
    private constructor(public props: Inputs.CreateUserInput) {}
  
    static fromRequest(body: unknown) {
      const requiredKeys = ["email", "firstName", "lastName", "username"];
      const isRequestInvalid =
        !body || typeof body !== "object" || TextUtil.isMissingKeys(body, requiredKeys);
  
      if (isRequestInvalid) {
        throw new ServerErrors.InvalidRequestBodyError(requiredKeys);
      }
  
      const input = body as Inputs.CreateUserInput;
  
      return CreateUserCommand.create(input);
    }
  
    static create(props: Inputs.CreateUserInput): Result<CreateUserCommand, ApplicationErrors.ValidationError> {
      const isEmailValid = props.email.indexOf("@") !== -1;
      const isFirstNameValid = TextUtil.isBetweenLength(props.firstName, 2, 16);
      const isLastNameValid = TextUtil.isBetweenLength(props.lastName, 2, 25);
      const isUsernameValid = TextUtil.isBetweenLength(props.username, 2, 25);
  
      if (
        !isEmailValid ||
        !isFirstNameValid ||
        !isLastNameValid ||
        !isUsernameValid
      ) {
        return fail(new ApplicationErrors.ValidationError())
      }
  
      const { username, email, firstName, lastName } = props;
  
      return success(new CreateUserCommand({ email, firstName, lastName, username }));
    }
  
    get email() {
      return this.props.email;
    }
  
    get firstName() {
      return this.props.firstName;
    }
  
    get lastName() {
      return this.props.lastName;
    }
  
    get username() {
      return this.props.username;
    }
  }
}

type AuthenticateResponse = any;

export const createUsersAPI = (apiURL: string) => {
  return {
    authenticate: async (code: string): Promise<API.CreateUserResponse> => {
      try {
        const successResponse = await axios.post(`${apiURL}/users/authenticate`, {
          code
        });
        return successResponse.data as AuthenticateResponse;
      } catch (_err: unknown) {
        if (axios.isAxiosError(_err) && _err.response) {
          return _err.response.data as AuthenticateResponse;
        }
        return {
          data: undefined,
          error: "Unknown error",
          success: false
        } as AuthenticateResponse;
      }
    },
    register: async (input: Inputs.CreateUserInput): Promise<API.CreateUserResponse> => {
      try {
        const successResponse = await axios.post(`${apiURL}/users/new`, {
          ...input,
        });
        return successResponse.data as API.CreateUserResponse;
      } catch (_err: unknown) {
        if (axios.isAxiosError(_err) && _err.response) {
          return _err.response.data as API.CreateUserResponse;
        }
        return {
          data: undefined,
          error: "Unknown error",
          success: false
        } as API.CreateUserResponse;
      }
    },
    getUserByEmail: async (email: string): Promise<GetUserByEmailResponse> => {
      try {
        const successResponse = await axios.get(`${apiURL}/users/${email}`);
        return successResponse.data as GetUserByEmailResponse;
      } catch (_err: unknown) {
        if (axios.isAxiosError(_err) && _err.response) {
          return _err.response.data as GetUserByEmailResponse;
        }
        return {
          data: undefined,
          error: "Unknown error",
          success: false
        } as GetUserByEmailResponse;
      }
    },
  };
};
