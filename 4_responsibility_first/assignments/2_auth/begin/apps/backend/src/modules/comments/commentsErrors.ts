import { Request, Response, NextFunction } from "express";
import { ApplicationErrors } from "@dddforum/errors/application";
import { API } from '@dddforum/api/comments';
import { CustomError } from "@dddforum/errors/custom";

export function commentsErrorHandler(
  error: CustomError,
  _: Request,
  res: Response,
  _next: NextFunction,
): Response<API.GetCommentsByPostIdAPIResponse> {

  const errorType = (error as ApplicationErrors.AnyApplicationError).type;

  switch (errorType) {
    case "PermissionError":
      return res.status(403).json({
        success: false,
        data: undefined,
        error: {
          code: error.name,
          message: error.message,
        }
      });
    case "ValidationError":
      return res.status(400).json({
        success: false,
        data: undefined,
        error: {
          code: error.name,
          message: error.message,
        }
      });
    case 'GenericServerError':
    default:
      return res.status(500).json({
        success: false,
        data: undefined,
        error: {
          code: error.name,
          message: error.message,
        }
      });
  }
} 