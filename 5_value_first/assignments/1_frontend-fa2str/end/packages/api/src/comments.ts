import axios, { AxiosError } from "axios";
import { APIResponse, getAuthHeaders } from ".";
import { DTOs as MemberDTOs } from "./members";

export namespace API {
  export type GetCommentsByPostIdAPIResponse = APIResponse<DTOs.CommentDTO[], 'COMMENTS_NOT_FOUND'>;
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

export const createCommentsAPI = (apiURL: string) => {
  return {
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