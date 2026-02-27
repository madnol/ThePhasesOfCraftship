import axios, {  } from "axios";
import { APIResponse, getAuthHeaders } from ".";
import { DTOs as MemberDTOs } from "./members";
import { ServerErrors } from '@dddforum/errors/server'
import { Result, success, Request, fail } from "@dddforum/core";
import { Types as UserTypes } from './users'
import { ApplicationErrors } from "@dddforum/errors/application";

export namespace API {
  export type GetCommentsByPostIdAPIResponse = APIResponse<DTOs.CommentDTO[], 'COMMENTS_NOT_FOUND'>;
  export type PostCommentAPIResponse = APIResponse<DTOs.CommentDTO, 'POST_NOT_FOUND' | 'INVALID_COMMENT'>;
}

export namespace DTOs {
  export type CommentDTO = {
    id: string;
    postId: string;
    commentId: string;
    parentCommentId?: string;
    text: string;
    member: MemberDTOs.MemberDTO;
    createdAt: string | Date;
    childComments: CommentDTO[];
    points: number;
  };
}

export namespace Inputs {
  export type PostCommentInput = {
    postId: string;
    text: string;
    memberId: string;
    parentCommentId?: string;
  };
}

export namespace Commands {
  export class PostCommentCommand {
    private constructor(public props: Inputs.PostCommentInput) {}

    static create (input: Inputs.PostCommentInput): Result<PostCommentCommand, ApplicationErrors.ValidationError> {
      const postId = input.postId;
      const text = input.text;
      const memberId = input.memberId

      if (!postId) {
        return fail(new ApplicationErrors.ValidationError('postId'));
      }
      if (!text || text === "" || text.length > 1000) {
        return fail(new ApplicationErrors.ValidationError('text'));
      }

      if (!memberId) {
        return fail(new ApplicationErrors.ValidationError('memberId'));
      }

      return success(new PostCommentCommand(input));
    }

    static fromRequest(
      body: Request['body'],
      decodedToken: UserTypes.DecodedIdToken | undefined,
    ): Result<PostCommentCommand, ServerErrors.MissingRequestParamsError> {   

      const input: Inputs.PostCommentInput = {
        postId: body.postId,
        text: body.text,
        parentCommentId: body.parentCommentId,
        memberId: body.memberId
      }   
      
      return this.create(input);
    }
  }
} 

export const createCommentsAPI = (apiURL: string) => {
  return {
    postComment: async (input: Inputs.PostCommentInput, authToken: string): Promise<API.PostCommentAPIResponse> => {
      try {        
        const successResponse = await axios.post(
          `${apiURL}/posts/${input.postId}/comments`,
          input,
          getAuthHeaders(authToken)
        );
        return successResponse.data as API.PostCommentAPIResponse;
      } catch (_err: unknown) {
        if (axios.isAxiosError(_err) && _err.response) {
          return _err.response.data as API.PostCommentAPIResponse;
        }
        return {
          data: undefined,
          error: {
            message: "Unknown error",
            code: 'INVALID_COMMENT'
          },
          success: false
        } as API.PostCommentAPIResponse;
      }
    },
    getCommentsByPostId: async (postId: string): Promise<API.GetCommentsByPostIdAPIResponse> => {
      try {
        const successResponse = await axios.get(
          `${apiURL}/posts/${postId}/comments`
        );
        return successResponse.data as API.GetCommentsByPostIdAPIResponse;
      } catch (_err: unknown) {
        if (axios.isAxiosError(_err) && _err.response) {
          return _err.response.data as API.GetCommentsByPostIdAPIResponse;
        }
        return {
          data: undefined,
          error: {
            message: "Unknown error",
            code: 'COMMENTS_NOT_FOUND'
          },
          success: false
        } as API.GetCommentsByPostIdAPIResponse;
      }
    }
  }
}