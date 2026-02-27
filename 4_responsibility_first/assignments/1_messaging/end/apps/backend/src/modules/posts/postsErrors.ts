import { Request, Response, NextFunction } from "express";

// Todo: clean these custom exceptions

import { ApplicationErrors } from "@dddforum/errors/application";
import { API } from '@dddforum/api/posts'
import { CustomError } from "@dddforum/errors/custom";

export function postsErrorHandler(
  error: CustomError,
  _: Request,
  res: Response,
  _next: NextFunction,
): Response<API.AnyPostsAPIResponse> {

  const errorType = (error as ApplicationErrors.AnyApplicationError).type;

  switch (errorType) {
    case "PermissionError":
      return res.status(403).json({
        success: false,
        data: undefined,
        error: {
          code: 403,
          message: error.message,
        }
      });
    case "ValidationError":
      return res.status(400).json({
        success: false,
        data: undefined,
        error: {
          code: 400,
          message: error.message,
        }
      });
    case 'GenericServerError':
    default:
      return res.status(500).json({
        success: false,
        data: undefined,
        error: {
          code: 500,
          message: error.message,
        }
      });
  }
}


